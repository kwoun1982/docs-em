Gate indicator — pass (green check), fail/blocked (red), fallback (amber, pulsing). For eval gates and runtime fallback reasons.

```jsx
<GateChip state="fail">L1 G1 미달</GateChip>
<GateChip state="pass">G1 PASS</GateChip>
<GateChip state="fallback">content empty → reasoning_content</GateChip>
```
