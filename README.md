# SQS Consumer Starter Monorepo

This workspace collects runnable examples for different runtimes as well as a shared suite of automated tests that exercise the [`sqs-consumer`](https://github.com/bbc/sqs-consumer) and [`sqs-producer`](https://github.com/bbc/sqs-producer) packages.

## Getting started

```bash
npm install
```

Run one of the examples (replace the workspace with the one you need):

```bash
npm run start --workspace @sqs-consumer-starter/ts-esm-example
```

## Tests

System-level checks for both the consumer and producer live in `packages/system-tests` and can be invoked with:

```bash
npm run test:system
# or run them (and any other package level tests) all at once
npm test
```

The tests mock the AWS SDK so they run without AWS credentials while still validating the integration surface.

## Canary automation

`scripts/update-canary.mjs` keeps every workspace pinned to the latest `sqs-consumer` canary release. A scheduled workflow (`.github/workflows/canary-monitor.yml`) runs daily and will:

1. Discover the newest canary tag.
2. Update every `package.json` that references `sqs-consumer` to that version.
3. Install dependencies, run the shared system tests, and open a pull request with the results whenever updates are required.

You can also run the updater locally:

```bash
node scripts/update-canary.mjs
npm install
npm run test:system
```
