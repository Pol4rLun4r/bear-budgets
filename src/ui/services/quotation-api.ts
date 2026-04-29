// api
import { baseAPI } from './path';

const create = async (data: CreateQuotation) => {
    const response = await baseAPI.quotation.create(data);
    return response;
}

const createQuotationAndItems = async (data: CreateWithAllData) => {
    const response = await baseAPI.quotation.createWithItems(data);
    return response;
}

export default { create, createQuotationAndItems };