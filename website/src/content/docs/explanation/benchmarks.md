---
title: Benchmarks
---

- Pure Index: `v1.0.0`
- Parser Config: `{ syntax: 'typescript', tsx: true, decorators: true }`
- Chip: `Apple M2 Pro`
- Memory: `16 GB`
- Node.js: `v20.10.0`
- Project files: `5176` (ts, tsx)
- Project packages: `44`
- Nx parallel: `12`

```rust title="Single Package"
// with unused export
total_time = 0.457 sec

// without unused exports
total_time = 0.399 sec
```

```rust title="All Packages"
// with unused export
total_time = 5.545 sec

// without unused exports
total_time = 5.485 sec
```
