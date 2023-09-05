import { DozerEndpoint, DozerQuery } from "@dozerjs/dozer";
import { useEffect, useState } from "react";
import { DozerConsumer } from "./context";
import { EventType, FieldDefinition, Operation, OperationType, Record, Type } from "@dozerjs/dozer/lib/esm/generated/types";

export function useDozerEndpointCount(name: string, options?: {
  query?: DozerQuery,
  watch?: EventType,
}) {
  const { count } = useDozerEndpointCommon(name, Object.assign({}, options, { onlyCount: true }));
  return { count };
}

export function useDozerEndpointQuery(name: string, options?: {
  query?: DozerQuery,
  watch?: EventType,
}) {
  const { fields, records, error } = useDozerEndpointCommon(name, Object.assign({}, options, { onlyQuery: true }));
  return { fields, records, error };
}

export function useDozerEndpointFields (name: string) {
  const opts = DozerConsumer();
  const endpoint = new DozerEndpoint(name, opts);
  const [fields, setFields] = useState<FieldDefinition[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    endpoint.getFields().then((response) => {
      setFields(response.fields);
    }).catch(error => {
      setError(error);
    });
  }, [name]);

  return { fields, error };
}

export function useDozerEndpoint(name: string, options?: {
  query?: DozerQuery,
  watch?: EventType,
}) {
  const { count, fields, records, error } = useDozerEndpointCommon(name, options);
  return { count, fields, records, error };
}

function useDozerEndpointCommon(name: string, options?: {
  query?: DozerQuery,
  watch?: EventType,
  onlyCount?: boolean,
  onlyQuery?: boolean,
}) {
  const [count, setCount] = useState<number>(0);
  const [fields, setFields] = useState<FieldDefinition[]>();
  const [primaryIndexKeys, setPrimaryIndexKeys] = useState<string[]>();
  const [records, setRecords] = useState<Record[]>([]);
  const [error, setError] = useState<Error>();
  const opts = DozerConsumer();
  const endpoint = new DozerEndpoint(name, opts);

  const limit = options?.query?.$limit ?? 50;
  const [buffer, setBuffer] = useState<Record[]>([]);

  useEffect(() => {
    setRecords(buffer.slice(0, limit));
  }, [buffer])

  useEffect(() => {
    options?.watch !== undefined && endpoint.getFields().then((response) => {
      setFields(response.fields);
      setPrimaryIndexKeys(response.primaryIndex.map((index: number) => response.fields[index].name));
    }).catch(error => {
      setError(error);
    });
  }, []);

  useEffect(() => {
    options?.onlyQuery || endpoint.count(options?.query).then((response) => {
      setCount(response.count)
    }).catch(error => {
      setError(error);
    });
  }, []);

  useEffect(() => {
    options?.onlyCount || endpoint.query(options?.query).then((response) => {
      setFields(response.fields);
      setBuffer(response.records.map(item => item.record!));
    }).catch(error => {
      setError(error);
    });
  }, []);

  useEffect(() => {
    if (options?.watch !== undefined) {
      const subscription = endpoint.OnEvent(options.watch, options.query?.$filter).subscribe((evt: Operation) => {
        console.log(evt);
        if (evt.typ === OperationType.INSERT) {
          options.onlyCount || setBuffer((prev: Record[]) => {
            if (prev.length < limit * 2 && evt.new) {
              return [...prev, evt.new];
            } else {
              return prev;
            }
          });
          options.onlyQuery || setCount((prev: number) => prev + 1);
        } else if (evt.typ === OperationType.DELETE) {
          options.onlyCount || setBuffer((prev: Record[]) => {
            const index = prev.findIndex((record) => compareFn(record, evt.old!, fields, primaryIndexKeys));
            if (index > -1) {
              prev.splice(index, 1);
              return prev;
            } else {
              return prev;
            }
          });
          options.onlyQuery || setCount((prev: number) => Math.max(prev - 1, 0));
        } else if (evt.typ === OperationType.UPDATE) {
          options.onlyCount || setBuffer((prev: Record[]) => {
            const index = prev.findIndex((record) => compareFn(record, evt.new!, fields, primaryIndexKeys));
            if (index > -1) {
              prev.splice(index, 1, evt.new!);
              return [...prev];;
            } else {
              return prev;
            }
          });
        }
      })
      return () => {
        subscription?.unsubscribe();
      }
    }
  }, [fields])

  return { error, count, fields, records };
}

function compareFn (record: Record, newValue: Record, fields?: FieldDefinition[], primaryIndexKeys?: string[]) {
  return primaryIndexKeys?.every((key) => {
    const k = key as keyof Record;
    const f = fields?.find((f) => f.name === key);
    if (f?.typ === Type.Point) {
      return record[k].toString() === newValue[k].toString();
    } else {
      return record[k] === record[k];
    }
  })
}