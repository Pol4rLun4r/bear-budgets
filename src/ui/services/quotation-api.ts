// api
import { baseAPI } from './path';

const create = async (data: CreateQuotation) => {
    const response = await baseAPI.quotation.create(data);
    return response;
}

const getAllSummary = async () => {
    const response = await baseAPI.quotation.getAllSummary();
    return response;
}

const getFull = async (quotationId: Quotation['id']) => {
    const response = await baseAPI.quotation.getFull(quotationId);
    return response;
};

const updateLine = async (data: UpdateQuotationLinePayload) => {
    const response = await baseAPI.quotation.updateLine(data);
    return response;
}

export default { create, getAllSummary, getFull, updateLine };