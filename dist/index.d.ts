import { ApiClient, ApiClientOptions, DozerFilter, DozerQuery } from "@dozerjs/dozer";
import { EventType, FieldDefinition, Operation } from "@dozerjs/dozer/lib/esm/generated/protos/types_pb";
import { RecordMapper } from "@dozerjs/dozer/lib/esm/helper";
type OnEventCallback = (data: Operation, fields: FieldDefinition[], primaryIndexKeys: string[], mapper: RecordMapper) => void;
type PartialType<Type> = {
    [Property in keyof Type]?: Type[Property];
};
type ClientParams = PartialType<ApiClientOptions> & {
    endpoint: string;
};
/**
 * @deprecated
 * use useDozerEndpointCount instead
 */
declare const useCount: (clientOrParams: ApiClient | ClientParams, query?: DozerQuery) => (number | ApiClient)[];
export interface CommonQueryStateType {
    records: Object[];
    fields: Object[];
}
/**
 * @deprecated
 * use useDozerEndpointQuery instead
 */
declare const useQueryCommon: (clientOrParams: ApiClient | ClientParams, query?: DozerQuery) => CommonQueryStateType;
/**
 * @deprecated
 * set watch to true in useDozerEndpoint, useDozerEndpointCount, useDozerEndpointQuery,
 */
declare const useOnEvent: (clientOrParams: ApiClient | ClientParams, cb: OnEventCallback, eventType?: EventType, filter?: DozerFilter) => FieldDefinition[][];
export * from './context';
export * from './useDozerClient';
export * from './useEndpoint';
export { useCount, useOnEvent, useQueryCommon };
