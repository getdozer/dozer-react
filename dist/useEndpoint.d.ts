import { DozerQuery, EventType, FieldDefinition } from "@dozerjs/dozer";
export declare function useDozerEndpointCount(name: string, options?: {
    query?: DozerQuery;
    watch?: EventType;
}): {
    count: number;
};
export declare function useDozerEndpointQuery(name: string, options?: {
    query?: DozerQuery;
    watch?: EventType;
}): {
    fields: FieldDefinition[] | undefined;
    records: Object[];
};
export declare function useDozerEndpoint(name: string, options?: {
    query?: DozerQuery;
    watch?: EventType;
}): {
    count: number;
    fields: FieldDefinition[] | undefined;
    records: Object[];
};
