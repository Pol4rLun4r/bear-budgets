// types
import type { QuotationQuery } from "../../types/quotation";
import type { Client } from "../../types/client";

// utils
import { success, failure } from "../../utils/handleSuccess";

export interface createQuotationDataType extends QuotationQuery {
    clientExists?: Client | undefined
}

const createQuotationRules = ({ client_id, notes, status, clientExists }: createQuotationDataType) => {
    const DEFAULT_STATUS = 0;
    
    // check is client exists
    if (!clientExists) {
        return failure('Cliente não existe');
    }

    const data: QuotationQuery = {
        client_id,
        notes: notes?.length !== 0 ? notes : undefined,
        status: status !== undefined ? status : DEFAULT_STATUS  
    }

    return success(data);
};

export default createQuotationRules;