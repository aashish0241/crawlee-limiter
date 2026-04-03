# crawlee-limiter

A lightweight library to limit the number of items scraped before stopping the Crawlee crawler.

## Features

- Simple function-based API
- Auto-stops crawler when limit reached
- Supports single items or arrays
- Works with Playwright, Puppeteer, and Basic crawlers
- TypeScript support

## Installation

```bash
npm install crawlee-limiter
# or
yarn add crawlee-limiter
```

Requires `crawlee` as a peer dependency:

```bash
npm install crawlee
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

    // Push data and stop when limit reached
    await limitPush(data, 50, crawler);
});

router.addDefaultHandler(async ({ page, request }) => {
    // Click and follow links to detail pages
    await page.click('a.product-link');
});
```

## Usage with Puppeteer

```typescript
import { createPuppeteerRouter } from 'crawlee';
import { limitPush } from 'crawlee-limiter';

export const router = createPuppeteerRouter();

router.addHandler('DETAIL', async ({ page, crawler }) => {
    const data = { 
        title: await page.title(),
        url: page.url() 
    };

    await limitPush(data, 100, crawler);
});
```

## Full Example

```typescript
import { PlaywrightCrawler, createPlaywrightRouter, Dataset } from 'crawlee';
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

router.addDefaultHandler(async ({ page, request }) => {
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

Push data to dataset and stop crawler when limit reached.

- `data` - Object or array of objects to save
- `max` - Maximum number of items to scrape  
- `crawler` - The Crawlee crawler instance

Returns `true` if data was pushed, `false` if limit already reached.

### `reset(crawler)`

Reset the counter for a crawler. Use this before starting a new crawl.

```typescript
reset(crawler); // Reset counter to 0
```

### `getCount(crawler)`

Get current item count for a crawler.

```typescript
const count = getCount(crawler); // e.g., 25
```

### `getLimit(crawler)`

Get the limit set for a crawler.

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
2. Each push increments the counter (array length counts as multiple items)
3. When counter reaches limit, the crawler automatically stops
4. Use `reset()` to clear the counter for a new crawl

## License

MIT
