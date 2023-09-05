import { DozerQuery } from "@dozerjs/dozer";
import { EventType, FieldDefinition, Record } from "@dozerjs/dozer/lib/esm/generated/types";
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
    records: Record[];
    error: Error | undefined;
};
export declare function useDozerEndpointFields(name: string): {
    fields: FieldDefinition[] | undefined;
    error: Error | undefined;
};
export declare function useDozerEndpoint(name: string, options?: {
    query?: DozerQuery;
    watch?: EventType;
}): {
    count: number;
    fields: FieldDefinition[] | undefined;
    records: Record[];
    error: Error | undefined;
};
