import { DozerEndpoint } from "@dozerjs/dozer";
import { useEffect, useState } from "react";
import { DozerConsumer } from "./context";
import { OperationType, Type } from "@dozerjs/dozer/lib/esm/generated/types";
export function useDozerEndpointCount(name, options) {
    const { count } = useDozerEndpointCommon(name, Object.assign({}, options, { onlyCount: true }));
    return { count };
}
export function useDozerEndpointQuery(name, options) {
    const { fields, records, error } = useDozerEndpointCommon(name, Object.assign({}, options, { onlyQuery: true }));
    return { fields, records, error };
}
export function useDozerEndpointFields(name) {
    const opts = DozerConsumer();
    const endpoint = new DozerEndpoint(name, opts);
    const [fields, setFields] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        endpoint.getFields().then((response) => {
            setFields(response.fields);
        }).catch(error => {
            setError(error);
        });
    }, [name]);
    return { fields, error };
}
export function useDozerEndpoint(name, options) {
    const { count, fields, records, error } = useDozerEndpointCommon(name, options);
    return { count, fields, records, error };
}
function useDozerEndpointCommon(name, options) {
    var _a, _b;
    const [count, setCount] = useState(0);
    const [fields, setFields] = useState();
    const [primaryIndexKeys, setPrimaryIndexKeys] = useState();
    const [records, setRecords] = useState([]);
    const [error, setError] = useState();
    const opts = DozerConsumer();
    const endpoint = new DozerEndpoint(name, opts);
    const limit = (_b = (_a = options === null || options === void 0 ? void 0 : options.query) === null || _a === void 0 ? void 0 : _a.$limit) !== null && _b !== void 0 ? _b : 50;
    const [buffer, setBuffer] = useState([]);
    useEffect(() => {
        setRecords(buffer.slice(0, limit));
    }, [buffer]);
    useEffect(() => {
        (options === null || options === void 0 ? void 0 : options.watch) !== undefined && endpoint.getFields().then((response) => {
            setFields(response.fields);
            setPrimaryIndexKeys(response.primaryIndex.map((index) => response.fields[index].name));
        }).catch(error => {
            setError(error);
        });
    }, []);
    useEffect(() => {
        (options === null || options === void 0 ? void 0 : options.onlyQuery) || endpoint.count(options === null || options === void 0 ? void 0 : options.query).then((response) => {
            setCount(response.count);
        }).catch(error => {
            setError(error);
        });
    }, []);
    useEffect(() => {
        (options === null || options === void 0 ? void 0 : options.onlyCount) || endpoint.query(options === null || options === void 0 ? void 0 : options.query).then((response) => {
            setFields(response.fields);
            setBuffer(response.records.map(item => item.record));
        }).catch(error => {
            setError(error);
        });
    }, []);
    useEffect(() => {
        var _a;
        if ((options === null || options === void 0 ? void 0 : options.watch) !== undefined) {
            const subscription = endpoint.OnEvent(options.watch, (_a = options.query) === null || _a === void 0 ? void 0 : _a.$filter).subscribe((evt) => {
                console.log(evt);
                if (evt.typ === OperationType.INSERT) {
                    options.onlyCount || setBuffer((prev) => {
                        if (prev.length < limit * 2 && evt.new) {
                            return [...prev, evt.new];
                        }
                        else {
                            return prev;
                        }
                    });
                    options.onlyQuery || setCount((prev) => prev + 1);
                }
                else if (evt.typ === OperationType.DELETE) {
                    options.onlyCount || setBuffer((prev) => {
                        const index = prev.findIndex((record) => compareFn(record, evt.old, fields, primaryIndexKeys));
                        if (index > -1) {
                            prev.splice(index, 1);
                            return prev;
                        }
                        else {
                            return prev;
                        }
                    });
                    options.onlyQuery || setCount((prev) => Math.max(prev - 1, 0));
                }
                else if (evt.typ === OperationType.UPDATE) {
                    options.onlyCount || setBuffer((prev) => {
                        const index = prev.findIndex((record) => compareFn(record, evt.new, fields, primaryIndexKeys));
                        if (index > -1) {
                            prev.splice(index, 1, evt.new);
                            return [...prev];
                            ;
                        }
                        else {
                            return prev;
                        }
                    });
                }
            });
            return () => {
                subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe();
            };
        }
    }, [fields]);
    return { error, count, fields, records };
}
function compareFn(record, newValue, fields, primaryIndexKeys) {
    return primaryIndexKeys === null || primaryIndexKeys === void 0 ? void 0 : primaryIndexKeys.every((key) => {
        const k = key;
        const f = fields === null || fields === void 0 ? void 0 : fields.find((f) => f.name === key);
        if ((f === null || f === void 0 ? void 0 : f.typ) === Type.Point) {
            return record[k].toString() === newValue[k].toString();
        }
        else {
            return record[k] === record[k];
        }
    });
}
