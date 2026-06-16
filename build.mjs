// docs/*.md → 단일 site/index.html 빌드 (좌측 메뉴 + 우측 본문)
// 외부 런타임 의존 없음: file:// 더블클릭으로 열림 (모든 문서 인라인 임베드)
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DOCS = join(ROOT, 'docs');

// 카테고리 표시 라벨 (디렉토리명 → 사람용)
const CAT_LABELS = {
  '00_결정': '결정해야 할 것',
  '01_시스템구성': '시스템 구성',
  '02_기획서': '기획서',
  '03_DATABASE': 'DATABASE',
  '04_아키텍처_API': '아키텍처 · API',
  '05_운영_평가': '운영 · 평가',
  '99_AI참조': 'AI 참조',
};

// 문서 제목: 파일 첫 # 헤딩 사용, 없으면 파일명
function titleOf(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

// 디렉토리 순회 → 카테고리별 문서 수집
function collect() {
  const cats = [];
  for (const dir of readdirSync(DOCS, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const catDir = join(DOCS, dir.name);
    const files = readdirSync(catDir)
      .filter((f) => f.endsWith('.md'))
      .sort();
    const docs = files.map((f) => {
      const md = readFileSync(join(catDir, f), 'utf8');
      const id = `${dir.name}/${f}`;
      return { id, file: f, title: titleOf(md, f.replace(/\.md$/, '')), md };
    });
    cats.push({ key: dir.name, label: CAT_LABELS[dir.name] || dir.name, docs });
  }
  cats.sort((a, b) => a.key.localeCompare(b.key));
  return cats;
}

// 문서 내부 상대링크(../, ./, *.md)를 사이트 내 해시 링크로 치환
function rewriteLinks(html, currentId) {
  return html.replace(/href="([^"]+\.md)(#[^"]*)?"/g, (_m, path, hash) => {
    // 절대/외부는 그대로
    if (/^https?:\/\//.test(path)) return `href="${path}${hash || ''}"`;
    // 시작프롬프트.md 등 docs 밖 → 비활성(앵커만 표시)
    const norm = path.replace(/^\.\//, '').replace(/^\.\.\//, '');
    // currentId의 카테고리 기준으로 해석
    const cat = currentId.split('/')[0];
    let target;
    if (path.startsWith('../')) {
      // ../03_DATABASE/00.md 또는 ../../시작프롬프트.md
      const up = path.replace(/^(\.\.\/)+/, '');
      if (up.includes('/')) target = up; // 카테고리/파일
      else return `href="#" data-ext title="문서 외부: ${up}" class="ext-link"`;
    } else {
      // 같은 카테고리 내 ./01.md
      const f = path.replace(/^\.\//, '');
      target = `${cat}/${f}`;
    }
    return `href="#${encodeURIComponent(target)}" data-nav`;
  });
}

const cats = collect();

// ```mermaid 코드블록 → <pre class="mermaid"> (mermaid.js가 렌더)
function mermaidBlocks(html) {
  return html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_m, code) => {
      // marked가 escape한 엔티티를 mermaid가 읽도록 복원
      const src = code
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      return `<pre class="mermaid">${src}</pre>`;
    }
  );
}

// 마크다운 → HTML (문서별)
marked.setOptions({ gfm: true, breaks: false });
const docsHtml = {};
for (const c of cats) {
  for (const d of c.docs) {
    let h = marked.parse(d.md);
    h = rewriteLinks(h, d.id);
    h = mermaidBlocks(h);
    docsHtml[d.id] = h;
  }
}

// 사이드바 HTML
const sidebar = cats
  .map((c) => {
    const items = c.docs
      .map(
        (d) =>
          `<a class="doc-link" href="#${encodeURIComponent(d.id)}" data-id="${d.id}">${escapeHtml(d.title)}</a>`
      )
      .join('\n');
    return `<div class="cat"><div class="cat-label">${escapeHtml(c.label)}</div>${items}</div>`;
  })
  .join('\n');

// 문서 본문 컨테이너 (모두 임베드, JS로 토글)
const articles = Object.entries(docsHtml)
  .map(
    ([id, h]) =>
      `<article class="doc" data-id="${id}" hidden>${h}</article>`
  )
  .join('\n');

const firstId = cats[0].docs[0].id;

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>docs-em 문서</title>
<style>
  :root{
    --bg:#0d1117; --panel:#161b22; --border:#21262d; --fg:#e6edf3;
    --muted:#8b949e; --accent:#58a6ff; --accent-bg:#1f6feb22;
    --code-bg:#1c2128; --th-bg:#1c2230;
  }
  *{box-sizing:border-box}
  html,body{margin:0;height:100%}
  body{
    font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Segoe UI",Roboto,"Malgun Gothic",sans-serif;
    background:var(--bg);color:var(--fg);display:flex;height:100vh;overflow:hidden;
    -webkit-font-smoothing:antialiased;
  }
  /* 사이드바 */
  #sidebar{
    width:300px;min-width:300px;height:100%;overflow-y:auto;
    background:var(--panel);border-right:1px solid var(--border);padding:18px 0;
  }
  #sidebar .brand{
    padding:0 20px 16px;font-size:15px;font-weight:700;letter-spacing:.3px;
    border-bottom:1px solid var(--border);margin-bottom:10px;color:var(--fg);
  }
  #sidebar .brand small{display:block;font-weight:400;color:var(--muted);font-size:11px;margin-top:4px}
  .cat{margin:4px 0 14px}
  .cat-label{
    padding:8px 20px 4px;font-size:11px;font-weight:700;color:var(--muted);
    text-transform:uppercase;letter-spacing:.6px;
  }
  .doc-link{
    display:block;padding:7px 20px 7px 26px;color:var(--fg);text-decoration:none;
    font-size:13.5px;line-height:1.4;border-left:2px solid transparent;
  }
  .doc-link:hover{background:#1f242c}
  .doc-link.active{
    color:var(--accent);background:var(--accent-bg);border-left-color:var(--accent);font-weight:600;
  }
  /* 본문 */
  #content{flex:1;height:100%;overflow-y:auto;padding:48px 56px 120px;}
  #content-inner{max-width:860px;margin:0 auto}
  article.doc{animation:fade .15s ease}
  @keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  /* 타이포 */
  #content h1{font-size:28px;border-bottom:1px solid var(--border);padding-bottom:14px;margin:0 0 24px}
  #content h2{font-size:21px;margin:36px 0 14px;padding-top:8px}
  #content h3{font-size:17px;margin:28px 0 10px}
  #content h4{font-size:15px;margin:22px 0 8px;color:var(--muted)}
  #content p,#content li{font-size:14.5px;line-height:1.75}
  #content a{color:var(--accent);text-decoration:none}
  #content a:hover{text-decoration:underline}
  #content a.ext-link{color:var(--muted);cursor:default;border-bottom:1px dotted var(--muted)}
  #content blockquote{
    border-left:3px solid var(--accent);background:#161b22;margin:16px 0;
    padding:10px 18px;color:var(--muted);border-radius:0 6px 6px 0;
  }
  #content blockquote p{margin:6px 0}
  #content code{
    background:var(--code-bg);padding:2px 6px;border-radius:4px;
    font-family:"SF Mono",ui-monospace,Menlo,monospace;font-size:12.5px;color:#ffa657;
  }
  #content pre{
    background:var(--code-bg);border:1px solid var(--border);border-radius:8px;
    padding:16px;overflow-x:auto;margin:16px 0;
  }
  #content pre code{background:none;padding:0;color:#e6edf3;font-size:12.5px;line-height:1.6}
  /* mermaid 다이어그램: 코드블록 스타일 제거, 중앙 정렬 */
  #content pre.mermaid{
    background:#0f141b;border:1px solid var(--border);border-radius:8px;
    padding:20px;text-align:center;overflow-x:auto;
    font-family:inherit;color:inherit;
  }
  #content pre.mermaid svg{max-width:100%;height:auto}
  #content pre.mermaid:not([data-processed]){color:var(--muted);font-size:12px}
  #content table{
    border-collapse:collapse;width:100%;margin:18px 0;font-size:13.5px;display:block;overflow-x:auto;
  }
  #content th,#content td{border:1px solid var(--border);padding:8px 12px;text-align:left;vertical-align:top}
  #content th{background:var(--th-bg);font-weight:600}
  #content tr:nth-child(even) td{background:#11151b}
  #content hr{border:none;border-top:1px solid var(--border);margin:28px 0}
  #content ul,#content ol{padding-left:24px}
  #content li{margin:4px 0}
  /* 스크롤바 */
  ::-webkit-scrollbar{width:10px;height:10px}
  ::-webkit-scrollbar-thumb{background:#30363d;border-radius:5px}
  ::-webkit-scrollbar-thumb:hover{background:#484f58}
  ::-webkit-scrollbar-track{background:transparent}
  @media(max-width:760px){
    #sidebar{width:220px;min-width:220px}
    #content{padding:28px 22px 80px}
  }
</style>
</head>
<body>
  <nav id="sidebar">
    <div class="brand">docs-em<small>로컬 LMStudio 한국어 문서 RAG · 설계 문서</small></div>
    ${sidebar}
  </nav>
  <main id="content">
    <div id="content-inner">
      ${articles}
    </div>
  </main>
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad:false, theme:'dark', securityLevel:'loose',
    themeVariables:{ fontSize:'14px', fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif' } });

  const links = document.querySelectorAll('.doc-link');
  const docs = document.querySelectorAll('article.doc');
  const content = document.getElementById('content');

  async function renderMermaid(article){
    const blocks = article.querySelectorAll('pre.mermaid:not([data-processed])');
    if(blocks.length){ try{ await mermaid.run({ nodes: blocks }); }catch(e){ console.error(e); } }
  }
  function show(id){
    let active=null;
    docs.forEach(d=>{ const on = d.dataset.id===id; d.hidden=!on; if(on) active=d; });
    if(!active){ id='${firstId}'; docs.forEach(d=>{ const on=d.dataset.id===id; d.hidden=!on; if(on) active=d; }); }
    links.forEach(l=>l.classList.toggle('active', l.dataset.id===id));
    content.scrollTop=0;
    if(active) renderMermaid(active);  // 처음 표시될 때만 렌더(이후 data-processed로 스킵)
  }
  function current(){
    const h=decodeURIComponent(location.hash.replace(/^#/,''));
    return h || '${firstId}';
  }
  window.addEventListener('hashchange',()=>show(current()));
  // 본문 내 data-nav 링크 클릭 시 해시 변경 → show 트리거
  show(current());
</script>
</body>
</html>`;

// GitHub Pages 게시 소스는 루트(/)만 허용(/site 불가) → 루트에 출력
writeFileSync(join(ROOT, 'index.html'), html, 'utf8');
// Jekyll 처리 비활성화(밑줄 폴더명 등 그대로 서빙)
writeFileSync(join(ROOT, '.nojekyll'), '', 'utf8');
console.log(`빌드 완료: index.html (${cats.reduce((n, c) => n + c.docs.length, 0)}개 문서, ${Math.round(Buffer.byteLength(html) / 1024)}KB)`);
