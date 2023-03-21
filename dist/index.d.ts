import { RecordMapper } from "@dozerjs/dozer/lib/esm/helper";
import { FieldDefinition, Operation } from "@dozerjs/dozer/lib/esm/generated/protos/types_pb";
import { DozerQuery } from "@dozerjs/dozer/lib/esm/query_helper";
type OnEventCallback = (data: Operation, fields: FieldDefinition[], primaryIndexKeys: string[], mapper: RecordMapper) => void;
declare const useCount: (endpoint: string) => number[];
export interface CommonQueryStateType {
    records: Object[];
    fields: Object[];
}
declare const useQueryCommon: (endpoint: string, query?: DozerQuery | null) => CommonQueryStateType;
declare const useOnEvent: (endpoint: string, cb: OnEventCallback) => FieldDefinition[][];
export { useQueryCommon, useCount, useOnEvent };
