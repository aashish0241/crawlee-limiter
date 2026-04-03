import type { BasicCrawler, Dictionary } from "crawlee";
export declare function limitPush(data: Dictionary | Dictionary[], max: number, crawler: BasicCrawler): Promise<boolean>;
export declare function reset(crawler: BasicCrawler): void;
export declare function getCount(crawler: BasicCrawler): number;
export declare function getLimit(crawler: BasicCrawler): number;
export declare function isLimitReached(crawler: BasicCrawler): boolean;
//# sourceMappingURL=index.d.ts.map