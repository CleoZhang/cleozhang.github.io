import axios from "axios";

const apiRoot = "http://localhost:3001";

export enum EndpointNames {
    Root = "",
    All = "all",
    Update = "update",
}

export function getEndpoint(route: string, endpoint: EndpointNames) {
    return `${apiRoot}/${route}/${endpoint}`;
}

export function axiosGetAll(route: string, callback: (data: any) => void) {
    axios.get(getEndpoint(route, EndpointNames.All)).then((response) => {
        callback(response.data);
      });
}

export function axiosCreate(route: string, newItem: any, callback: (data: any) => void, additionalCallback?: () => void) {
    axios.post(getEndpoint(route, EndpointNames.Root), newItem).then((response) => {
        callback(response.data);
        additionalCallback && additionalCallback();
    });
}

export function axiosDelete(route: string, deletedItemId: number, callback: (data: any) => void) {
    axios.delete(getEndpoint(route, EndpointNames.Root), { data: { id: deletedItemId } }).then((response) => {
        callback(response.data);
      });
}

export function axiosUpdate(route: string, updatedItem: any, callback: (data: any) => void) {
    axios.post(getEndpoint(route, EndpointNames.Update), updatedItem).then((response) => {
        callback(response.data);
      });
}