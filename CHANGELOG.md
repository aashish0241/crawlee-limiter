# Changelog

## [1.3.0] - 2026-04-06

### Changed
- **Apify Dataset Push**: Replaced `crawler.getDataset()` + `pushData()` with Apify's `Dataset.pushData()` static method directly
  - No longer requires the crawler to implement `getDataset()`
  - Data goes straight to the Apify default dataset
  - Peer dependency changed from `crawlee` to `apify`
  - `AnyCrawler` interface now only requires `stop()` — no `getDataset()` needed

### Fixed
- **Array overshoots limit**: When pushing an array with more items than remaining slots, the array is now clipped to fit exactly within the limit instead of exceeding it
- **Race condition**: Count is now incremented **before** the async `Dataset.pushData()` call so that concurrent request handlers cannot simultaneously pass the limit check and both push, causing overshoot

### Migration from v1.2.x
Change your peer dependency from `crawlee` to `apify`:
```bash
npm install apify
```
No code changes are required. The function signatures are identical.

---

## [1.2.2] - 2026-04-03

### Fixed
- **Universal Crawler Compatibility**: Complete fix for TypeScript type errors with all Crawlee crawler types
  - Now uses structural typing (duck typing) instead of inheritance-based typing
  - Accepts ANY object with `getDataset()` and `stop()` methods
  - Works with CheerioCrawler, PlaywrightCrawler, PuppeteerCrawler, BasicCrawler, HttpCrawler, JSDOMCrawler
  - Works with custom crawler implementations
  - Fixed error: "Type 'CheerioCrawler' is not assignable to parameter"

### Technical Details
The library now uses a minimal interface approach:
```typescript
interface AnyCrawler {
  getDataset(): Promise<Dataset>;
  stop(): Promise<void>;
}
```

This means it will work with ANY crawler that has these two methods, regardless of the class hierarchy.

### Migration Guide
If you were using v1.0.x or v1.2.1, no code changes are required. The library is now more flexible and will work with any crawler type:

```typescript
// All of these now work without TypeScript errors:
import { CheerioCrawler } from 'crawlee';
import { PlaywrightCrawler } from 'crawlee';
import { limitPush } from 'crawlee-limiter';

// CheerioCrawler ✅
await limitPush(data, 50, cheerioCrawler);

// PlaywrightCrawler ✅
await limitPush(data, 50, playwrightCrawler);

// Any other crawler type ✅
await limitPush(data, 50, anyCrawler);
```

## [1.2.1] - 2026-04-03

### Changed
- **Universal Crawler Support**: Uses structural typing (duck typing) instead of class inheritance
  - Accepts ANY object with `getDataset()` and `stop()` methods
  - No longer depends on specific Crawlee class types
  - Works with CheerioCrawler, PlaywrightCrawler, PuppeteerCrawler, BasicCrawler, HttpCrawler, JSDOMCrawler, and any custom crawler implementations
- Removed `@crawlee/cheerio` from dependencies (now uses main `crawlee` package)
- Updated peer dependency to `crawlee >= 3.0.0` (was `>= 1.0.0`)
- Made all functions generic to accept any crawler type that implements the required interface

## [1.0.2] - Previous Release
- Initial stable release
