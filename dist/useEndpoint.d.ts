import { DozerQuery } from "@dozerjs/dozer";
import { EventType, FieldDefinition } from "@dozerjs/dozer/lib/esm/generated/protos/types_pb";
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
    records: Object[];
    error: Error | undefined;
};
