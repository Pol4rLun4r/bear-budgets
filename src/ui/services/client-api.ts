// api
import { baseAPI } from "./path";

const search = async (query: SearchClient) => {
    const response = await baseAPI.client.search(query);
    return response;
};

const create = async (data: Client) => {
    const response = await baseAPI.client.create(data);
    return response;
};

// const get = async (client_id: number) => {
//     const response = await axios.get(`${baseUrl}/clients/get`, {
//         params: { client_id }
//     });
//     return response.data;
// };

export default { search, create };