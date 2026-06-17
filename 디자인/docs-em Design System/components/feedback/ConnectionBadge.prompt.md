Air-gapped trust signals for the header. `ConnectionBadge` shows `● localhost:1234 연결됨` (teal/amber/red); `ExternalCallsCounter` shows `EXTERNAL CALLS: 0` (green at 0, red on violation). Both are first-class — never hide them.

```jsx
<ConnectionBadge status="ok" endpoint="localhost:1234" />
<ExternalCallsCounter count={0} />
```
