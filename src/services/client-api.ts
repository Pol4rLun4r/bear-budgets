// api
import axios from "axios";

// types
import { ClientQuery } from "../../types/client";

// alterar depois
export const baseUrl = 'http://localhost:4000';

// types
export type SearchClientDataType = {
    value: string;
    type: string
}

const search = async (data: SearchClientDataType) => {
    const response = await axios.post(`${baseUrl}/clients/search`, data);
    return response.data
}

const create = async (data: ClientQuery) => {
    const response = await axios.post(`${baseUrl}/clients/`, data);
    return response.data
}

export default { search, create };