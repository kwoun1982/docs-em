Status indicator for runs, documents, and checks — mono label, tone-colored. `ok` (teal) is the only resting state that carries color; reserve `warn`/`error` for risk.

```jsx
<StatusPill tone="ok">indexed</StatusPill>
<StatusPill tone="warn">regression −0.04</StatusPill>
<StatusPill tone="error" indicator="icon">failed</StatusPill>
<StatusPill tone="running">embedding…</StatusPill>
<StatusPill tone="neutral" size="sm">queued</StatusPill>
```

Tones: `ok`/`warn`/`error`/`running`/`neutral`. `indicator` = `dot` (default) or `icon`.
