# crawlee-limiter

A lightweight library to limit the number of items scraped before stopping the Crawlee crawler. Uses the **Apify dataset** directly for pushing data.

## Features

- Simple function-based API
- Pushes data directly via Apify `Dataset.pushData()` — no crawler dataset method needed
- Auto-stops crawler when limit is reached
- Clips arrays to never exceed the item limit
- Safe under concurrent requests (race-condition-free count tracking)
- Supports single items or arrays
- Works with **ALL** Crawlee crawler types (structural/duck typing)
- TypeScript support

## Installation

```bash
npm install crawlee-limiter
# or
yarn add crawlee-limiter
```

Requires `apify` as a peer dependency:

```bash
npm install apify
```

## Quick Start

```typescript
import { createPlaywrightRouter } from 'crawlee';
import { limitPush } from 'crawlee-limiter';

export const router = createPlaywrightRouter();

router.addHandler('DETAIL', async ({ page, crawler }) => {
    const data = { 
        title: await page.title(),
        url: page.url() 
    };

    // Push data to Apify dataset and stop when limit reached
    await limitPush(data, 50, crawler);
});

router.addDefaultHandler(async ({ page }) => {
    await page.click('a.product-link');
});
```

## Usage with CheerioCrawler

```typescript
import { CheerioCrawler, createCheerioRouter } from 'crawlee';
import { limitPush } from 'crawlee-limiter';

const router = createCheerioRouter();

router.addDefaultHandler(async ({ $, request, crawler }) => {
    const data = { 
        title: $('title').text(),
        url: request.url 
    };

    await limitPush(data, 100, crawler);
});

const crawler = new CheerioCrawler({ router });
await crawler.run(['https://example.com']);
```

## Full Example

```typescript
import { PlaywrightCrawler, createPlaywrightRouter } from 'crawlee';
import { limitPush, reset, getCount, getLimit, isLimitReached } from 'crawlee-limiter';

const router = createPlaywrightRouter();

router.addHandler('DETAIL', async ({ page, crawler }) => {
    const data = { 
        title: await page.title(),
        url: page.url() 
    };

    await limitPush(data, 50, crawler);
    
    console.log(`Progress: ${getCount(crawler)}/${getLimit(crawler)}`);
});

router.addDefaultHandler(async ({ page }) => {
    await page.click('a.product-link');
});

const crawler = new PlaywrightCrawler({
    router,
    maxRequestRetries: 3,
});

await crawler.run(['https://example.com/products']);

// Check if limit was reached
if (isLimitReached(crawler)) {
    console.log('Crawler stopped due to limit!');
}

// Reset for next crawl
reset(crawler);
```

## API

### `limitPush(data, max, crawler)`

Push data to the Apify dataset and stop the crawler when the limit is reached.

- `data` — Object or array of objects to save
- `max` — Maximum number of items to scrape
- `crawler` — Any crawler instance with a `stop()` method

Returns `true` if data was pushed, `false` if the limit was already reached.

> **Note:** When passing an array, it is automatically clipped to the remaining slots so the total never exceeds `max`.

### `reset(crawler)`

Reset the counter for a crawler. Use this before starting a new crawl.

```typescript
reset(crawler);
```

### `getCount(crawler)`

Get the current item count.

```typescript
const count = getCount(crawler); // e.g., 25
```

### `getLimit(crawler)`

Get the configured limit.

```typescript
const limit = getLimit(crawler); // e.g., 50
```

### `isLimitReached(crawler)`

Check if the limit has been reached.

```typescript
if (isLimitReached(crawler)) {
    console.log('Limit reached!');
}
```

## How It Works

1. First call to `limitPush` initializes the counter with the `max` value
2. The count is incremented **before** the async push to prevent race conditions in concurrent request handlers
3. Arrays are clipped to the remaining available slots — the total will never exceed `max`
4. When the count reaches the limit, the crawler is automatically stopped
5. Use `reset()` to clear the counter before a new crawl

## License

MIT
