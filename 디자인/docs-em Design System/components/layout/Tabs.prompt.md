Underline tab bar, teal active underline. Optional `count` badge per tab.

```jsx
<Tabs
  value={tab}
  onChange={setTab}
  items={[
    { value: "all", label: "전체", count: 42 },
    { value: "fail", label: "실패", count: 3 },
    { value: "regress", label: "회귀", count: 5 },
  ]}
/>
```
