// api
import axios from "axios";
import { baseUrl } from "./url";

// types
import { ClientQuery } from "../../core/types/client";

// types
export type SearchClientDataType = {
    value: string;
    type: string
};

const search = async (data: SearchClientDataType) => {
    const response = await axios.post(`${baseUrl}/clients/search`, data);
    return response.data;
};

const create = async (data: ClientQuery) => {
    const response = await axios.post(`${baseUrl}/clients/`, data);
    return response.data;
};

const get = async (client_id: number) => {
    const response = await axios.get(`${baseUrl}/clients/get`, {
        params: { client_id }
    });
    return response.data;
};

export default { search, create, get };