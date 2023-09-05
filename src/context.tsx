import { DozerClientOptions } from '@dozerjs/dozer';
import React, { ReactNode, createContext, useContext } from 'react';


const DozerContext = createContext<DozerClientOptions | null>(null);


const DozerProvider = (props: { children: ReactNode; value: DozerClientOptions }) => {
  return <DozerContext.Provider value={props.value}> {props.children} </DozerContext.Provider>;
};

const DozerConsumer = () => {
  const value = useContext(DozerContext);
  if (value === null) {
    throw new Error('DozerConsumer must be used within a DozerProvider.');
  }
  return value;
}

export { DozerConsumer, DozerProvider };
