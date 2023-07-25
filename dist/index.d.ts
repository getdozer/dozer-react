import { FieldDefinition, Operation } from "@dozerjs/dozer/lib/esm/generated/protos/types_pb";
import { RecordMapper } from "@dozerjs/dozer/lib/esm/helper";
import { DozerQuery } from "@dozerjs/dozer/lib/esm/query_helper";
import { useDozerClient } from "./useDozerClient";
import { useDozerEndpoint, useDozerEndpointCount, useDozerEndpointQuery } from "./useEndpoint";
import { DozerConsumer, DozerProvider } from "./context";
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
export { useCount, useDozerClient, useDozerEndpoint, useDozerEndpointCount, useDozerEndpointQuery, useOnEvent, useQueryCommon, DozerConsumer, DozerProvider };
