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

### `useDozerEndpointCount(endpoint: string)`

This hook returns number of records in endpoint.
```javascript
import { EventType } from '@dozerjs/dozer';
import { useDozerEndpointCount } from "@dozerjs/dozer-react";
// ...

const AirportComponent = () => {
    // count will be updated on any change in airports endpoint
    // if you don't want to watch for changes, you can remove watch option
    const [count] = useDozerEndpointCount('airports', { watch: EventType.ALL });

    return <span>Total airports count: {count}</span>
}
```

### `useQueryCommon(endpoint: string, query: string | null = null)`
This hook can be used for getting data from cache. It allows to pass [query](https://getdozer.io/docs/api/grpc/common#dozer-common-QueryRequest). 
Query is json object serialized as string.
```javascript
import { EventType } from '@dozerjs/dozer';
import { useDozerEndpointQuery } from "@dozerjs/dozer-react";
// ...

const AirportComponent = () => {
    let query = {
      orderBy: {
        start: Order.ASC
      }
    }
    // records will be updated on any change in airports endpoint
    // if you don't want to watch for changes, you can remove watch option
    const [records, fields] = useDozerEndpointQuery('airports', { query, watch: EventType.ALL });
    
    return <>{records.map(r => <div>{ r.name }</div>)}</>
}
```

### `useOnEvent(endpoint: string, cb: (data, fields, primaryIndexKeys, mapper) => ()`
UseOnEvent hook can be used for getting data updates from dozer. It uses callback to pass operations.
Callback has 4 arguments: 
- `data` - Operation event. Reference to structure can be found [here](https://getdozer.io/docs/api/grpc/common#dozer-types-Operation)
- `fields` - Fields array, which are used for mapping operation data.
- `primaryIndexKeys` - Array of primary key fields indexes
- `mapper` - Mapper instance, which can be used for converting data.

```javascript
import { EventType } from '@dozerjs/dozer';

const AirportsComponent = () => {
    // count and records will be updated on any change in airports endpoint
    // if you don't want to watch for changes, you can remove watch option
    const [count, records, fields] = useDozerEndpoint('airports', { watch: EventType.ALL });
    
    return <>
        <div>Count: {count}</div>
        {airports.map((airport, idx) => <div key={idx}>{ airport.name }</div>)}
    </>
}
```