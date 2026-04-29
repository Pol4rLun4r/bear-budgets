// utils
import { success, failure } from "../../utils/handleSuccess.js";

const getItemNotesRules = (item_reference_id: ItemNote['item_reference_id']) => {
    // check if item_reference_id is informed
    if (item_reference_id == null || item_reference_id === undefined) {
        return failure("ID da referência do item não informado");
    }

    // check if item_reference_id is a number
    if (typeof item_reference_id !== "number" || Number.isNaN(item_reference_id)) {
        return failure("ID da referência do item deve ser um número");
    }

    // check if item_reference_id is a positive integer
    if (!Number.isInteger(item_reference_id) || item_reference_id < 1) {
        return failure("ID da referência do item deve ser um número inteiro positivo");
    }

    return success(item_reference_id);
};

export default getItemNotesRules;