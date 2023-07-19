<div align="center">
    <a target="_blank" href="https://getdozer.io/">
        <br><img src="https://dozer-assets.s3.ap-southeast-1.amazonaws.com/logo-blue.svg" width=40%><br>
    </a>
</div>

<p align="center">
    <br />
    <b>
    Connect any data source, combine them in real-time and instantly get low-latency gRPC and REST APIs.<br>
    ⚡ All with just a simple configuration! ⚡️
    </b>
</p>
<br />

<p align="center">
  <a href="https://github.com/getdozer/dozer/actions/workflows/dozer.yaml" target="_blank"><img src="https://github.com/getdozer/dozer/actions/workflows/dozer.yaml/badge.svg" alt="CI"></a>
  <a href="https://coveralls.io/github/getdozer/dozer?branch=main" target="_blank"><img src="https://coveralls.io/repos/github/getdozer/dozer/badge.svg?branch=main&t=kZMYaV&style=flat" alt="Coverage Status"></a>
  <a href="https://getdozer.io/docs/dozer" target="_blank"><img src="https://img.shields.io/badge/doc-reference-green" alt="Docs"></a>
  <a href="https://discord.com/invite/3eWXBgJaEQ" target="_blank"><img src="https://img.shields.io/badge/join-on%20discord-primary" alt="Join on Discord"></a>
  <a href="https://github.com/getdozer/dozer-python/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>

</p>
<br>

## Overview
This repository is a react helpers for using [Dozer](https://github.com/getdozer/dozer) as data provider.
It contains 3 hooks `useCount`, `useQueryCommon`, `useOnEvent`
## Installation

```bash
yarn add @dozerjs/dozer-react
```

## Usage

### `useCount(clientOrParams: ApiClient | ClientParams, query?: DozerQuery)`

This hook returns number of records in endpoint.
It can have 2 arguments:
- clientOrParams: The clientOrParams parameter can be either an instance of ApiClient or an object of type ClientParams with the following properties:
  - endpoint (string): The endpoint to connect to.
  - authToken (string): Optional authentication token.
- query: An optional DozerQuery object specifying the query parameters.

```javascript
import { useCount } from "@dozerjs/dozer-react";
// ...

const AirportComponent = () => {
  const [count, client] = useCount({ endpoint: "airports" });

  return <span>Total airports count: {count}</span>;
};
```

### `useQueryCommon(clientOrParams: ApiClient | ClientParams, query?: DozerQuery)`
This hook can be used for getting data from cache. It allows to pass [query](https://getdozer.io/docs/api/grpc/common#dozer-common-QueryRequest).
Query is json object serialized as string.
It can have 2 arguments:
- clientOrParams: The clientOrParams parameter can be either an instance of ApiClient or an object of type ClientParams with the following properties:
  - endpoint (string): The endpoint to connect to.
  - authToken (string): Optional authentication token.
- query: An optional DozerQuery object specifying the query parameters.

```javascript
import { useQueryCommon } from "@dozerjs/dozer-react";
// ...

const AirportComponent = () => {
  let query = {
    orderBy: {
      start: Order.ASC,
    },
  };
  const [records, fields] = useQueryCommon({ endpoint: "airports" }, query);

  return (<>{records.map((r) => (<div>{r.name}</div>))}</>);
};
```

### `useOnEvent(clientOrParams: ApiClient | ClientParams, cb: (data, fields, primaryIndexKeys, mapper) => (), eventType?: EventType, filter?: DozerFilter)`
UseOnEvent hook can be used for getting data updates from dozer. It uses callback to pass operations.
Callback has 4 arguments:
- `data` - Operation event. Reference to structure can be found [here](https://getdozer.io/docs/api/grpc/common#dozer-types-Operation)
- `fields` - Fields array, which are used for mapping operation data.
- `primaryIndexKeys` - Array of primary key fields indexes
- `mapper` - Mapper instance, which can be used for converting data.
  There are 2 optional parameters usable here:
- `eventType` - Optional, specify an event to update the data.
- `filter` - Optional, specify a filter to refine the event selection.

```javascript
const AirportsComponent = () => {
  const [airports, setAirports] = useState([]);

  useOnEvent({ endpoint: "airports" }, (data, fields, primaryIndexKeys, mapper) => {
      if (fields.length) {
        setAirports((records) => {
          if (data.getTyp() === OperationType.UPDATE) {
            let oldValue = mapper.mapRecord(data.getOld().getValuesList());
            let existingIndex = records.findIndex((v) => primaryIndexKeys.every((index) => v[index] === oldValue[index]));

            if (records.length > 0) {
              if (existingIndex > -1) {
                records[existingIndex] = mapper.mapRecord(data.getNew().getValuesList());
                return [...records];
              } else {
                return [...records, mapper.mapRecord(data.getNew().getValuesList()),];
              }
            }
          } else if (data.getTyp() === OperationType.INSERT) {
            return [...records, mapper.mapRecord(data.getNew().getValuesList()),];
          }

          return records;
        });
      }
    },
    eventType, // Specify the desired event type (optional)
    filter // Specify a filter to further refine the event selection (optional)
  );

  return (<>{airports.map((airport) => (<div>{airport.name}</div>))}</>);
};
```
