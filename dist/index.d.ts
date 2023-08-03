import { DozerQuery, FieldDefinition, Operation } from "@dozerjs/dozer";
import { RecordMapper } from "@dozerjs/dozer/lib/esm/helper";
type OnEventCallback = (data: Operation, fields: FieldDefinition[], primaryIndexKeys: string[], mapper: RecordMapper) => void;
/**
 * @deprecated
 * use useDozerEndpointCount instead
 */
declare const useCount: (endpoint: string, authToken: string | null) => number[];
export interface CommonQueryStateType {
    records: Object[];
    fields: Object[];
}
/**
 * @deprecated
 * use useDozerEndpointQuery instead
 */
declare const useQueryCommon: (endpoint: string, query: DozerQuery | null | undefined, authToken: string | null) => CommonQueryStateType;
/**
 * @deprecated
 * set watch to true in useDozerEndpoint, useDozerEndpointCount, useDozerEndpointQuery,
 */
declare const useOnEvent: (endpoint: string, cb: OnEventCallback, authToken: string | null) => FieldDefinition[][];
export * from './context';
export * from './useDozerClient';
export * from './useEndpoint';
export { useCount, useOnEvent, useQueryCommon };
