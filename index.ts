import { Dataset } from "apify";

// Minimal interface for any Crawlee crawler
interface AnyCrawler {
  stop(): Promise<void>;
}

const crawlerState = new WeakMap<
  AnyCrawler,
  { count: number; limit: number }
>();

export async function limitPush<T extends AnyCrawler>(
  data: Record<string, any> | Record<string, any>[],
  max: number,
  crawler: T,
): Promise<boolean> {
  let state = crawlerState.get(crawler);

  if (!state) {
    state = { count: 0, limit: max };
    crawlerState.set(crawler, state);
  }

  const remaining = state.limit - state.count;
  if (remaining <= 0) {
    return false;
  }

  // Clip array to remaining slots so we never exceed the limit
  const dataToSend = Array.isArray(data) ? data.slice(0, remaining) : data;
  const itemsToAdd = Array.isArray(dataToSend) ? dataToSend.length : 1;

  // Increment count BEFORE the async push to prevent race conditions
  // when multiple concurrent requests pass the limit check simultaneously
  state.count += itemsToAdd;

  await Dataset.pushData(dataToSend);

  if (state.count >= state.limit) {
    console.log(`[Limiter] Reached ${state.limit} items. Stopping crawler...`);
    await crawler.stop();
    return false;
  }

  return true;
}

export function reset<T extends AnyCrawler>(crawler: T): void {
  crawlerState.delete(crawler);
}

export function getCount<T extends AnyCrawler>(crawler: T): number {
  const state = crawlerState.get(crawler);
  return state?.count ?? 0;
}

export function getLimit<T extends AnyCrawler>(crawler: T): number {
  const state = crawlerState.get(crawler);
  return state?.limit ?? 0;
}

export function isLimitReached<T extends AnyCrawler>(crawler: T): boolean {
  const state = crawlerState.get(crawler);
  return state ? state.count >= state.limit : false;
}
