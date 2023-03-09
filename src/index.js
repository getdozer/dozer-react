import { useEffect, useState } from "react";
import { ApiClient } from "@getdozer/dozer-js";
import { RecordMapper } from "@getdozer/dozer-js/lib/esm/helper";

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
const useCount = (endpoint) => {
  const [count, setCount] = useState(0)
  let client = new ApiClient(endpoint);
  useEffect(() => {
    client.count().then((response) => {
      setCount(response.getCount)
    });
  }, [])

  return [count];
};

const useQueryCommon = (endpoint, query = null) => {
  const [state, setState] = useState({ records: [], fields: [] });

  let client = new ApiClient(endpoint);
  useEffect(() => {
    client.query(query).then(([fields, records]) => {
      setState({records, fields});
    });
  }, [])

  return state;
};

const useOnEvent = (endpoint, cb) => {
  const [fields, setFields] = useState([])
  const [primaryIndexKeys, setPrimaryIndexKeys] = useState([]);
  const [mapper, setMapper] = useState(null);
  const [isCalled, setIsCalled] = useState(false);

  useEffect(() => {
    if (!isCalled) {
      setIsCalled(true);
      let client = new ApiClient(endpoint);
      client.getFields().then(response => {
        let fields = response.getFieldsList();
        setFields(fields);
        let primaryIndexList = response.getPrimaryIndexList();
        setMapper(new RecordMapper(fields));
        setPrimaryIndexKeys(primaryIndexList.map(index => fields[index].getName()));
      });

      if (fields.length > 0) {
        let stream = client.onEvent();
        stream.on('data', (data) => cb(data, fields, primaryIndexKeys, mapper));
      }
    }
  }, [fields, isCalled]);

  return [fields];
};

export { useQueryCommon, useCount, useOnEvent }