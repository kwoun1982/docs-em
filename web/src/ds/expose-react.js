// 호이스팅 함정 회피용 전용 모듈.
// 이 파일을 main.jsx의 "최상단 첫 import"로 두면 import 평가 순서상
// window.React / window.ReactDOM 이 _ds_bundle.js·화면 모듈보다 먼저 채워진다.
import React from "react";
import ReactDOM from "react-dom/client";

window.React = React;
window.ReactDOM = ReactDOM;
