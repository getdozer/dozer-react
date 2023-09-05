import React, { createContext, useContext } from 'react';
const DozerContext = createContext(null);
const DozerProvider = (props) => {
    return React.createElement(DozerContext.Provider, { value: props.value },
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
