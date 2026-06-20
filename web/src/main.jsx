// import 순서 = 로드 순서. (Option B — plugin-react 가 화면 .jsx 를 직접 변환)
// side-effect 모듈들은 tree-shake 되지 않고 평가되어 Object.assign(window, …) 가 실행된다.
import "./ds/expose-react.js";   // 1) window.React / window.ReactDOM 먼저 (호이스팅 함정 회피)
import "./ds/styles.css";        // 2) 토큰·폰트 (styles.css 가 tokens/* import)
import { initTheme, getTheme, applyTheme } from "./ds/theme.js";  // 다크/라이트
import "./ds/_ds_bundle.js";     // 3) window.DocsEmDesignSystem_afe3d1 채움
import "./screens/AppShell.jsx";   // 4) window.AppShell / Logo / SideRail / RailSection
import "./screens/QueryScreen.jsx"; // 5) window.QueryScreen
import "./screens/IndexScreen.jsx"; // 6) window.IndexScreen
import "./screens/EvalScreen.jsx";  // 7) window.EvalScreen
import "./screens/MonitorScreen.jsx"; // 8) window.MonitorScreen
import "./screens/LoginScreen.jsx"; // 9) window.LoginScreen

initTheme();   // 저장된 테마(기본 다크) 즉시 적용.

function App() {
  // (mock) 인증 게이트 — 미로그인=LoginScreen, 로그인=3화면. 화면만(검증 없음).
  const [authed, setAuthed] = window.React.useState(false);
  const [active, setActive] = window.React.useState("query");
  const [theme, setTheme] = window.React.useState(getTheme());

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  };

  if (!authed) {
    return window.React.createElement(window.LoginScreen, { onSuccess: () => setAuthed(true), theme, onToggleTheme: toggleTheme });
  }

  const Screen = active === "query" ? window.QueryScreen
               : active === "index" ? window.IndexScreen
               : active === "eval" ? window.EvalScreen
               : window.MonitorScreen;
  return window.React.createElement(
    window.AppShell,
    { active, onNavigate: setActive, onLogout: () => setAuthed(false), theme, onToggleTheme: toggleTheme },
    window.React.createElement(Screen)
  );
}

window.ReactDOM.createRoot(document.getElementById("app"))
  .render(window.React.createElement(App));
