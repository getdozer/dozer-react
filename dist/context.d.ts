import { DozerClientOptions } from '@dozerjs/dozer';
import { ReactNode } from 'react';
declare const DozerProvider: (props: {
    children: ReactNode;
    value?: DozerClientOptions;
}) => JSX.Element;
declare const DozerConsumer: () => {
    client: import("@dozerjs/dozer").DozerClient;
};
export { DozerConsumer, DozerProvider };
