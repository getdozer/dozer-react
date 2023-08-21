import { DozerClientOptions } from '@dozerjs/dozer';
import React, { ReactNode } from 'react';
declare const DozerProvider: (props: {
    children: ReactNode;
    value?: DozerClientOptions;
}) => React.JSX.Element;
declare const DozerConsumer: () => {
    client: import("@dozerjs/dozer").DozerClient;
};
export { DozerConsumer, DozerProvider };
