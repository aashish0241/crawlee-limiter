import type { BasicCrawler, Dictionary } from "crawlee";

const crawlerState = new WeakMap<BasicCrawler, { count: number; limit: number }>();

export async function limitPush(
  data: Dictionary | Dictionary[],
  max: number,
  crawler: BasicCrawler
): Promise<boolean> {
  let state = crawlerState.get(crawler);

  if (!state) {
    state = { count: 0, limit: max };
    crawlerState.set(crawler, state);
  }

  if (state.count >= state.limit) {
    return false;
  }

  const itemsToAdd = Array.isArray(data) ? data.length : 1;

  const dataset = await crawler.getDataset();
  await dataset.pushData(data);

  state.count += itemsToAdd;

  if (state.count >= state.limit) {
    console.log(`[Limiter] Reached ${state.limit} items. Stopping crawler...`);
    await crawler.stop();
    return false;
  }

  return true;
}

export function reset(crawler: BasicCrawler): void {
  crawlerState.delete(crawler);
}

export function getCount(crawler: BasicCrawler): number {
  const state = crawlerState.get(crawler);
  return state?.count ?? 0;
}

export function getLimit(crawler: BasicCrawler): number {
  const state = crawlerState.get(crawler);
  return state?.limit ?? 0;
}

export function isLimitReached(crawler: BasicCrawler): boolean {
  const state = crawlerState.get(crawler);
  return state ? state.count >= state.limit : false;
}
