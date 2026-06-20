import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Option B: plugin-react가 화면 .jsx(side-effect 모듈)를 직접 JSX 변환한다.
// base:'./' — 어떤 정적 서버에도 서빙되도록 상대 경로.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
