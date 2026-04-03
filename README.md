# crawlee-limiter

A lightweight library to limit the number of items scraped before stopping the Crawlee crawler.

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

## Usage

```typescript
import { createPlaywrightRouter } from 'crawlee';
import { limitPush, reset, getCount, getLimit, isLimitReached } from 'crawlee-limiter';

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

## API

### `limitPush(data, max, crawler)`

Push data to dataset and stop crawler when limit reached.

- `data` - Object or array of objects to save
- `max` - Maximum number of items to scrape
- `crawler` - The Crawlee crawler instance

Returns `true` if data was pushed, `false` if limit already reached.

### `reset(crawler)`

Reset the counter for a crawler.

### `getCount(crawler)`

Get current item count for a crawler.

### `getLimit(crawler)`

Get the limit set for a crawler.

### `isLimitReached(crawler)`

Check if the limit has been reached.

## License

MIT
