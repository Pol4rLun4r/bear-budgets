// utils
import { success, failure } from "../../utils/handleSuccess.js";

export interface CreateQuotationRules extends CreateQuotation {
    clientExists?: Client | undefined
}

const createQuotationRules = ({ client_id, notes, status, clientExists }: CreateQuotationRules) => {
    const DEFAULT_STATUS = 0;
    
    // check is client exists
    if (!clientExists) {
        return failure('Cliente não existe');
    }

    const data: CreateQuotation = {
        client_id,
        notes: notes?.length !== 0 ? notes : undefined,
        status: status !== undefined ? status : DEFAULT_STATUS,
    }

    return success(data);
};

export default createQuotationRules;