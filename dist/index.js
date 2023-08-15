var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { ApiClient } from "@dozerjs/dozer";
import { HealthCheckResponse } from "@dozerjs/dozer/lib/esm/generated/protos/health_pb";
import { RecordMapper } from "@dozerjs/dozer/lib/esm/helper";
import { useEffect, useState } from "react";
var ServingStatus = HealthCheckResponse.ServingStatus;
/**
 * @deprecated
 * called in the methods of DozerEndpoint already
 */
const waitForHealthyService = (client, cb) => {
    let startService = () => {
        client.healthCheck().then(status => {
            if (status.getStatus() === ServingStatus.SERVING) {
                cb();
            }
            else {
                setTimeout(startService, 1000);
            }
        }).catch(() => {
            setTimeout(startService, 1000);
        });
    };
    startService();
};
const getClient = (clientOrParams) => {
    if (!(clientOrParams instanceof ApiClient)) {
        const { endpoint } = clientOrParams, clientOptions = __rest(clientOrParams, ["endpoint"]);
        return new ApiClient(endpoint, clientOptions);
    }
    return clientOrParams;
};
/**
 * @deprecated
 * use useDozerEndpointCount instead
 */
const useCount = (clientOrParams, query) => {
    const [count, setCount] = useState(0);
    const client = getClient(clientOrParams);
    useEffect(() => {
        client.count(query).then((response) => {
            setCount(response.getCount);
        });
    }, []);
    return [count, client];
};
/**
 * @deprecated
 * use useDozerEndpointQuery instead
 */
const useQueryCommon = (clientOrParams, query) => {
    const [state, setState] = useState({ records: [], fields: [] });
    const client = getClient(clientOrParams);
    useEffect(() => {
        waitForHealthyService(client, () => {
            client.query(query).then(([fields, records]) => {
                setState({ records, fields });
            });
        });
    }, []);
    return state;
};
/**
 * @deprecated
 * set watch to true in useDozerEndpoint, useDozerEndpointCount, useDozerEndpointQuery,
 */
const useOnEvent = (clientOrParams, cb, eventType, filter) => {
    const [fields, setFields] = useState([]);
    const [isCalled, setIsCalled] = useState(false);
    let client = getClient(clientOrParams);
    useEffect(() => {
        if (!isCalled) {
            setIsCalled(true);
            waitForHealthyService(client, () => {
                client.getFields().then(response => {
                    let fields = response.getFieldsList();
                    setFields(fields);
                    let primaryIndexList = response.getPrimaryIndexList();
                    const mapper = new RecordMapper(fields);
                    const primaryIndexKeys = primaryIndexList.map(index => fields[index].getName());
                    return { fields, mapper, primaryIndexKeys };
                }).then(({ fields, mapper, primaryIndexKeys }) => {
                    if (fields.length > 0) {
                        let stream = client.onEvent(eventType, filter);
                        stream.on('data', (data) => cb(data, fields, primaryIndexKeys, mapper));
                    }
                });
            });
        }
    }, [isCalled]);
    return [fields];
};
export * from './context';
export * from './useDozerClient';
export * from './useEndpoint';
export { useCount, useOnEvent, useQueryCommon };
