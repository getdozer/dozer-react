import { DozerEndpointEvent, DozerFilter, DozerQuery, EventType, OperationType } from "@dozerjs/dozer";
import { useEffect, useState } from "react";
import { DozerConsumer } from "./context";
import { FieldDefinition, Record } from "@dozerjs/dozer";

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
  const { fields, records } = useDozerEndpointCommon(name, Object.assign({}, options, { onlyQuery: true }));
  return { fields, records };
}

export function useDozerEndpoint(name: string, options?: {
  query?: DozerQuery,
  watch?: EventType,
}) {
  const { count, fields, records } = useDozerEndpointCommon(name, options);
  return { count, fields, records };
}

function useDozerEndpointCommon(name: string, options?: {
  query?: DozerQuery,
  watch?: EventType,
  onlyCount?: boolean,
  onlyQuery?: boolean,
}) {
  const [count, setCount] = useState<number>(0);
  const [fields, setFields] = useState<FieldDefinition[]>();
  const [records, setRecords] = useState<Object[]>([]);
  const { client } = DozerConsumer();
  const endpoint = client.getEndpoint(name);

  const limit = options?.query?.limit ?? 50;
  const [buffer, setBuffer] = useState<Object[]>([]);

  useEffect(() => {
    setRecords(buffer.slice(0, limit));
  }, [buffer])

  useEffect(() => {
    options?.onlyQuery || endpoint.count(options?.query).then((response) => {
      setCount(response.getCount())
    });
  }, []);

  useEffect(() => {
    options?.onlyCount || endpoint.query(options?.query).then((response) => {
      const [fields, records] = response;
      setFields(fields);
      setBuffer(records);
    });
  }, []);

  useEffect(() => {
    if (options?.watch) {
      const stream = endpoint.onEvent((evt: DozerEndpointEvent) => {
        if (evt.data.typ === OperationType.INSERT) {
          options.onlyCount || setBuffer((prev: Object[]) => {
            if (prev.length < limit * 2 && evt.data.new) {
              return [...prev, evt.data.new];
            } else {
              return prev;
            }
          });
          options.onlyQuery || setCount((prev: number) => prev + 1);
        } else if (evt.data.typ === OperationType.DELETE) {
          options.onlyCount || setBuffer((prev: Object[]) => {
            const newValue = evt.data.new ?? {};
            const index = prev.findIndex((record) => {
              return evt.primaryIndexKeys.every((key) => {
                return (record as Record)[key as keyof Record] === (newValue as Record)[key as keyof Record];
              })
            });
            if (index > -1) {
              return prev.splice(index, 1);
            } else {
              return prev;
            }
          });
          options.onlyQuery || setCount((prev: number) => Math.max(prev - 1, 0));
        } else if (evt.data.typ === OperationType.UPDATE) {
          options.onlyCount || setBuffer((prev: Object[]) => {
            const newValue = evt.data.new ?? {};
            const index = prev.findIndex((record) => {
              return evt.primaryIndexKeys.every((key) => {
                return (record as Record)[key as keyof Record] === (newValue as Record)[key as keyof Record];
              })
            });
            if (index > -1) {
              return prev.splice(index, 1, newValue);
            } else {
              return prev;
            }
          });
        }
      }, options.watch, options.query?.filter);
      return () => {
        stream?.cancel();
      }
    }
  }, [])

  return { count, fields, records };
}