// api
import { baseAPI } from "./path";

const searchItem = async (query: Pick<ItemReference, "description">) => {
    const response = await baseAPI.item.searchReferences(query);
    return response;
}

// const getNotes = async (item_reference_id: number) => {
//     const response = await axios.get(`${baseUrl}/quotations/items/reference-notes`, {
//         params: { item_reference_id }
//     });
//     return response.data;
// }

export default { searchItem };