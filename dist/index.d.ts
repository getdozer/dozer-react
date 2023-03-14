import { RecordMapper } from "@getdozer/dozer-js/lib/esm/helper";
import { FieldDefinition, Operation } from "@getdozer/dozer-js/lib/esm/generated/protos/types_pb";
import { DozerQuery } from "@getdozer/dozer-js/lib/esm/query_helper";
type OnEventCallback = (data: Operation, fields: FieldDefinition[], primaryIndexKeys: string[], mapper: RecordMapper) => void;
declare const useCount: (endpoint: string) => number[];
export interface CommonQueryStateType {
    records: Object[];
    fields: Object[];
}
declare const useQueryCommon: (endpoint: string, query?: DozerQuery | null) => CommonQueryStateType;
declare const useOnEvent: (endpoint: string, cb: OnEventCallback) => FieldDefinition[][];
export { useQueryCommon, useCount, useOnEvent };
