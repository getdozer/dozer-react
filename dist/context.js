import React, { createContext, useContext } from 'react';
import { useDozerClient } from './useDozerClient';
const DozerContext = createContext(null);
const DozerProvider = (props) => {
    const value = useDozerClient(props.value);
    return React.createElement(DozerContext.Provider, { value: value },
        " ",
        props.children,
        " ");
};
const DozerConsumer = () => {
    const value = useContext(DozerContext);
    if (value === null) {
        throw new Error('DozerConsumer must be used within a DozerProvider.');
    }
    return value;
};
export { DozerConsumer, DozerProvider };
