// api
import axios from "axios";
import { baseUrl } from "./url";

const searchItem = async (query: string) => {
    const response = await axios.post(`${baseUrl}/quotations/items/search-references`, { query });
    return response.data;
}

export default { searchItem };