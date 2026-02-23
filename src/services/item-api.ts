// api
import axios from "axios";
import { baseUrl } from "./url";

const searchItem = async (query: string) => {
    const response = await axios.post(`${baseUrl}/quotations/items/search-references`, { query });
    return response.data;
}

const getNotes = async (item_reference_id: number) => {
    const response = await axios.get(`${baseUrl}/quotations/items/reference-notes`, {
        params: { item_reference_id }
    });
    return response.data;
}

export default { searchItem, getNotes };