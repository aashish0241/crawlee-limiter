interface AnyCrawler {
    stop(): Promise<void>;
}
export declare function limitPush<T extends AnyCrawler>(data: Record<string, any> | Record<string, any>[], max: number, crawler: T): Promise<boolean>;
export declare function reset<T extends AnyCrawler>(crawler: T): void;
export declare function getCount<T extends AnyCrawler>(crawler: T): number;
export declare function getLimit<T extends AnyCrawler>(crawler: T): number;
export declare function isLimitReached<T extends AnyCrawler>(crawler: T): boolean;
export {};
//# sourceMappingURL=index.d.ts.map