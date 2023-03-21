import { useEffect, useState } from "react";
import { ApiClient } from "@dozerjs/dozer";
import { RecordMapper } from "@dozerjs/dozer/lib/esm/helper";
import { FieldDefinition, Operation } from "@dozerjs/dozer/lib/esm/generated/protos/types_pb";
import { DozerQuery } from "@dozerjs/dozer/lib/esm/query_helper";
import { HealthCheckResponse } from "@dozerjs/dozer/lib/esm/generated/protos/health_pb";
import ServingStatus = HealthCheckResponse.ServingStatus;

type OnEventCallback = (data: Operation, fields: FieldDefinition[], primaryIndexKeys: string[], mapper: RecordMapper) => void

const waitForHealthyService = (client: ApiClient, cb: () => void) => {
  let startService = () => {
    client.healthCheck().then(status => {
      if (status.getStatus() === ServingStatus.SERVING) {
        cb();
      } else {
        setTimeout(startService, 1000);
      }
    }).catch(() => {
      setTimeout(startService, 1000);
    });
  }

  startService();
}
// TODO: Refactor this to useStreamWithInitialQuery
// const useGrpcData = (endpoint) => {
//   const [fields, setFields] = useState([])
//   const [state, setState] = useState({ records: [] });
//
//   let client = new DozerClient(endpoint);
//   useEffect(() => {
//     client.query().then((response) => {
//       let mapper = new RecordMapper(response.getFieldsList());
//       setFields(response.getFieldsList());
//       setState({records: response.getRecordsList().map(v => mapper.mapRecord(v.getRecord().getValuesList()))});
//     });
//   }, [])
//
//   useEffect(() => {
//     if (fields.length > 0) {
//       client.getFields().then(fieldsResponse => {
//         let fields = fieldsResponse.getFieldsList();
//         let mapper = new RecordMapper(fieldsResponse.getFieldsList());
//         let primaryIndexList = fieldsResponse.getPrimaryIndexList();
//         let primaryIndexKeys = primaryIndexList.map(index => fields[index].getName());
//
//         let stream = client.onEvent();
//         stream.on('data', data => {
//           if (data.getTyp() === OperationType.UPDATE) {
//             let oldValue = mapper.mapRecord(data.getOld().getValuesList());
//             let records = state.records;
//             let existingIndex = records.findIndex(v => primaryIndexKeys.every(k => v[k] === oldValue[k]))
//
//             if (existingIndex > -1) {
//               records[existingIndex] = mapper.mapRecord(data.getNew().getValuesList());
//               setState({ records: [...records] });
//             }
//           }
//         });
//       })
//     }
//   }, [fields]);
//
//   return [state.records, fields];
// }
//
const useCount = (endpoint: string) => {
  const [count, setCount] = useState(0)
  let client = new ApiClient(endpoint);
  useEffect(() => {
    client.count().then((response) => {
      setCount(response.getCount)
    });
  }, [])

  return [count];
};

export interface CommonQueryStateType {
  records: Object[],
  fields: Object[]
}

const useQueryCommon = (endpoint: string, query: DozerQuery | null = null) => {
  const [state, setState] = useState<CommonQueryStateType>({ records: [], fields: [] });

  let client = new ApiClient(endpoint);
  useEffect(() => {
    waitForHealthyService(client, () => {
      client.query(query).then(([fields, records]) => {
        setState({records, fields});
      });
    });
  }, [])

  return state;
};

const useOnEvent = (endpoint: string, cb: OnEventCallback) => {
  const [fields, setFields] = useState<FieldDefinition[]>([])
  const [isCalled, setIsCalled] = useState(false);

  let client = new ApiClient(endpoint);
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
            let stream = client.onEvent();
            stream.on('data', (data) => cb(data, fields, primaryIndexKeys, mapper));
          }
        });
      });
    }
  }, [isCalled]);

  return [fields];
};

export { useQueryCommon, useCount, useOnEvent }