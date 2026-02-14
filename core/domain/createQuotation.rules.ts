// types
import type { QuotationQuery } from "../repositories/quotation.repository";
import type { ClientQuery } from "../repositories/client.repository";

// utils
import { validateDocument } from "../utils/documentValidator";
import { success, failure } from "../utils/handleSuccess";

export interface createQuotationType extends QuotationQuery, ClientQuery { }

interface createQuotationRulesType extends createQuotationType {
    clientIdExists: number | undefined;// client_id exists 
    clientExists: number | undefined; // registered customer exists
}

const createQuotationRules = ({ client_id }: createQuotationRulesType) => {
    
};

export default createQuotationRules;