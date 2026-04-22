// type
import type { QuotationQuery } from '../../core/types/quotation';
import { QuotationPayload } from '../components/createBudget/createBudgetButton/@CreateBudgetButton';

// api
import axios from 'axios';
import { baseUrl } from './url';

const create = async (data: QuotationQuery) => {
    const response = await axios.post(`${baseUrl}/quotations/`, data);
    return response.data;
}

const createQuotationAndItems = async (data: QuotationPayload) => {
    const response = await axios.post(`${baseUrl}/quotations/items`, data);
    return response.data;
}

export default { create, createQuotationAndItems };