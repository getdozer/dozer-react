import { DozerClientOptions } from '@dozerjs/dozer';
import { ReactNode } from 'react';
declare const DozerProvider: (props: {
    children: ReactNode;
    value: DozerClientOptions;
}) => JSX.Element;
declare const DozerConsumer: () => DozerClientOptions;
export { DozerConsumer, DozerProvider };
