// api
import { baseAPI } from "./path";

const searchDescription = async (query: SearchItemDescription) => {
    const response = await baseAPI.item.searchDescription(query);
    return response;
}

// const getNotes = async (item_reference_id: number) => {
//     const response = await axios.get(`${baseUrl}/quotations/items/reference-notes`, {
//         params: { item_reference_id }
//     });
//     return response.data;
// }

export default { searchDescription };