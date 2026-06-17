Styled native select with a chevron affordance.

```jsx
<Select value={model} onChange={e => setModel(e.target.value)}
  options={["qwen2.5-7b-instruct", "llama-3.1-8b", "exaone-3.5"]} />
<Select options={[{value:"recall", label:"recall@5"}, {value:"mrr", label:"MRR"}]} />
```

Sizes `sm`/`md`/`lg`.
