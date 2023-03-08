import { useEffect, useState } from "react";
import { DozerClient } from "@getdozer/dozer-js/src/client";
import { RecordMapper } from "@getdozer/dozer-js/src/helper";
import { OperationType } from "@getdozer/dozer-js/generated/protos/types_pb";

const useGrpcData = (endpoint) => {
  const [fields, setFields] = useState([])

  const [state, setState] = useState({ records: [] });

  let client = new DozerClient(endpoint);
  useEffect(() => {
    client.query().then((response) => {
      let mapper = new RecordMapper(response.getFieldsList());
      setFields(response.getFieldsList());
      setState({records: response.getRecordsList().map(v => mapper.mapRecord(v.getRecord().getValuesList()))});
    });
  }, [])

  useEffect(() => {
    if (fields.length > 0) {
      client.getFields().then(fieldsResponse => {
        let fields = fieldsResponse.getFieldsList();
        let mapper = new RecordMapper(fieldsResponse.getFieldsList());
        let primaryIndexList = fieldsResponse.getPrimaryIndexList();
        let primaryIndexKeys = primaryIndexList.map(index => fields[index].getName());

        let stream = client.onEvent();
        stream.on('data', data => {
          if (data.getTyp() === OperationType.UPDATE) {
            let oldValue = mapper.mapRecord(data.getOld().getValuesList());
            let records = state.records;
            let existingIndex = records.findIndex(v => primaryIndexKeys.every(k => v[k] === oldValue[k]))

            if (existingIndex > -1) {
              records[existingIndex] = mapper.mapRecord(data.getNew().getValuesList());
              setState({ records: [...records] });
            }
          }
        });
      })
    }
  }, [fields]);

  return [state.records, fields];
}

export { useGrpcData }