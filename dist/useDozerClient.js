import { DozerClient } from "@dozerjs/dozer";
const defaultDozerClientOptions = {
    serverAddress: "http://localhost:50051",
};
export function useDozerClient(value) {
    const options = value !== null && value !== void 0 ? value : defaultDozerClientOptions;
    const client = new DozerClient(options);
    return { client };
}
