import { OperationType, Type } from "@dozerjs/dozer";
import { useEffect, useState } from "react";
import { DozerConsumer } from "./context";
export function useDozerEndpointCount(name, options) {
    const { count } = useDozerEndpointCommon(name, Object.assign({}, options, { onlyCount: true }));
    return { count };
}
export function useDozerEndpointQuery(name, options) {
    const { fields, records } = useDozerEndpointCommon(name, Object.assign({}, options, { onlyQuery: true }));
    return { fields, records };
}
export function useDozerEndpoint(name, options) {
    const { count, fields, records } = useDozerEndpointCommon(name, options);
    return { count, fields, records };
}
function useDozerEndpointCommon(name, options) {
    var _a, _b;
    const [count, setCount] = useState(0);
    const [fields, setFields] = useState();
    const [records, setRecords] = useState([]);
    const { client } = DozerConsumer();
    const endpoint = client.getEndpoint(name);
    const limit = (_b = (_a = options === null || options === void 0 ? void 0 : options.query) === null || _a === void 0 ? void 0 : _a.limit) !== null && _b !== void 0 ? _b : 50;
    const [buffer, setBuffer] = useState([]);
    useEffect(() => {
        setRecords(buffer.slice(0, limit));
    }, [buffer]);
    useEffect(() => {
        (options === null || options === void 0 ? void 0 : options.onlyQuery) || endpoint.count(options === null || options === void 0 ? void 0 : options.query).then((response) => {
            setCount(response.getCount());
        });
    }, []);
    useEffect(() => {
        (options === null || options === void 0 ? void 0 : options.onlyCount) || endpoint.query(options === null || options === void 0 ? void 0 : options.query).then((response) => {
            const [fields, records] = response;
            setFields(fields);
            setBuffer(records);
        });
    }, []);
    useEffect(() => {
        var _a;
        if ((options === null || options === void 0 ? void 0 : options.watch) !== undefined) {
            const stream = endpoint.onEvent((evt) => {
                if (evt.data.typ === OperationType.INSERT) {
                    options.onlyCount || setBuffer((prev) => {
                        if (prev.length < limit * 2 && evt.data.new) {
                            return [...prev, evt.data.new];
                        }
                        else {
                            return prev;
                        }
                    });
                    options.onlyQuery || setCount((prev) => prev + 1);
                }
                else if (evt.data.typ === OperationType.DELETE) {
                    options.onlyCount || setBuffer((prev) => {
                        const index = prev.findIndex((record) => compareFn(record, evt.data.new, evt.fields, evt.primaryIndexKeys));
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
                else if (evt.data.typ === OperationType.UPDATE) {
                    options.onlyCount || setBuffer((prev) => {
                        var _a;
                        const newValue = (_a = evt.data.new) !== null && _a !== void 0 ? _a : {};
                        const index = prev.findIndex((record) => compareFn(record, evt.data.new, evt.fields, evt.primaryIndexKeys));
                        if (index > -1) {
                            prev.splice(index, 1, newValue);
                            return [...prev];
                            ;
                        }
                        else {
                            return prev;
                        }
                    });
                }
            }, options.watch, (_a = options.query) === null || _a === void 0 ? void 0 : _a.filter);
            return () => {
                stream === null || stream === void 0 ? void 0 : stream.cancel();
            };
        }
    }, []);
    return { count, fields, records };
}
function compareFn(record, newValue = {}, fields, primaryIndexKeys) {
    return primaryIndexKeys.every((key) => {
        const k = key;
        const f = fields === null || fields === void 0 ? void 0 : fields.find((f) => f.getName() === key);
        if ((f === null || f === void 0 ? void 0 : f.getTyp()) === Type.POINT) {
            return record[k].toString() === newValue[k].toString();
        }
        else {
            return record[k] === newValue[k];
        }
    });
}
