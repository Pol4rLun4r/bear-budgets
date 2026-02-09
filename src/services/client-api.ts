import axios from "axios";

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

export default { search }