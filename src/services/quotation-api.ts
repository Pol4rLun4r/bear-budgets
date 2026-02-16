// type
import type { QuotationQuery } from '../../types/quotation';

// api
import axios from 'axios';
import { baseUrl } from './url';

const create = async (data: QuotationQuery) => {
    const response = await axios.post(`${baseUrl}/quotations/`, data);
    return response.data;
}

export default { create };