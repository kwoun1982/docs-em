/* docs-em — mock WebSocket. 표준 브라우저 WebSocket API 흉내.
 *
 * 실 배선 시 교체 지점(화면 코드는 그대로):
 *     const ws = new MockSocket("ws://localhost:1234/monitor");
 *  →  const ws = new WebSocket("ws://localhost:1234/monitor");
 *
 * 동일 표면: readyState(+CONNECTING/OPEN/CLOSING/CLOSED 상수),
 *   onopen/onmessage/onclose/onerror, addEventListener/removeEventListener,
 *   send(data), close(). 메시지는 event.data = JSON 문자열({type:"monitor", payload}).
 *
 * 서버 push 흉내: 연결 후 2s 간격으로 monitor 스냅샷을 emit.
 * 재연결 시뮬레이션: 가끔 drop → onclose → 1.2s 후 자동 재연결(onopen 재발생).
 * fetch·실제 네트워크 0건(INV-3). Math.random 은 브라우저 앱 코드라 사용 가능.
 */
import { snapshotMonitor } from "./index.js";

const PUSH_MS = 800;        // 서버 push 주기(고빈도 → 역동적 체감)
const DROP_PROB = 0.015;    // 매 push 시 끊길 확률(재연결 데모; 고빈도라 낮춤)
const RECONNECT_MS = 1000;  // 끊김 후 자동 재연결까지

export class MockSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url = "ws://localhost:1234/monitor") {
    this.url = url;
    this.readyState = MockSocket.CONNECTING;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this._listeners = {};   // addEventListener 호환
    this._pushTimer = null;
    this._openTimer = null;
    this._closedByUser = false;
    this._open(120);        // 최초 연결(가짜 핸드셰이크 지연)
  }

  // ── 표준 EventTarget 흉내 ──────────────────────────────────────────
  addEventListener(type, fn) { (this._listeners[type] || (this._listeners[type] = [])).push(fn); }
  removeEventListener(type, fn) {
    const a = this._listeners[type]; if (!a) return;
    const i = a.indexOf(fn); if (i >= 0) a.splice(i, 1);
  }
  _emit(type, ev) {
    const h = this["on" + type];
    if (typeof h === "function") h.call(this, ev);
    (this._listeners[type] || []).forEach((fn) => fn.call(this, ev));
  }

  // ── 표준 WebSocket 메서드 ──────────────────────────────────────────
  send(_data) { /* mock: 서버로 보낼 것 없음. 실 배선 시 구독 메시지 등에 사용. */ }

  close(code = 1000, reason = "client closed") {
    this._closedByUser = true;
    this._teardown();
    this.readyState = MockSocket.CLOSED;
    this._emit("close", { code, reason, wasClean: true });
  }

  // ── 내부: 연결/끊김/푸시 ───────────────────────────────────────────
  _open(delay) {
    this.readyState = MockSocket.CONNECTING;
    this._openTimer = setTimeout(() => {
      if (this._closedByUser) return;
      this.readyState = MockSocket.OPEN;
      this._emit("open", { type: "open" });
      this._schedulePush();
    }, delay);
  }

  _schedulePush() {
    this._pushTimer = setTimeout(async () => {
      if (this.readyState !== MockSocket.OPEN) return;

      // 가끔 끊김 → 재연결 데모.
      if (Math.random() < DROP_PROB) {
        this.readyState = MockSocket.CLOSED;
        this._emit("close", { code: 1006, reason: "connection lost", wasClean: false });
        if (!this._closedByUser) this._open(RECONNECT_MS); // 자동 재연결
        return;
      }

      const payload = await snapshotMonitor();  // 동적 스냅샷(랜덤 워크)
      this._emit("message", { data: JSON.stringify({ type: "monitor", payload }) });
      this._schedulePush();
    }, PUSH_MS);
  }

  _teardown() {
    clearTimeout(this._pushTimer);
    clearTimeout(this._openTimer);
    this._pushTimer = this._openTimer = null;
  }
}
