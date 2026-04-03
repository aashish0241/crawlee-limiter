const crawlerState = new WeakMap();
export async function limitPush(data, max, crawler) {
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
export function reset(crawler) {
    crawlerState.delete(crawler);
}
export function getCount(crawler) {
    const state = crawlerState.get(crawler);
    return state?.count ?? 0;
}
export function getLimit(crawler) {
    const state = crawlerState.get(crawler);
    return state?.limit ?? 0;
}
export function isLimitReached(crawler) {
    const state = crawlerState.get(crawler);
    return state ? state.count >= state.limit : false;
}
//# sourceMappingURL=index.js.map