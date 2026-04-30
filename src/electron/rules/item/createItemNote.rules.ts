import { success, failure } from "../../utils/handleSuccess.js";

export interface CreateItemNoteRules extends ItemNote {
    itemReferenceIdExists: number | undefined
}

const createItemNoteRules = ({ content, type, item_reference_id, itemReferenceIdExists }: CreateItemNoteRules) => {
    // verifica se o id existe
    if (!itemReferenceIdExists) {
        return failure("item_reference_id não existe ou não foi informado");
    }

    // verifica se o conteúdo foi informado
    if (!content) {
        return failure("Conteúdo não foi informado");
    }

    // verifica se algum tipo foi informado
    if (type !== "link" && type !== 'text') {
        return failure(`Este tipo:${type} de nota não é válido`);
    }

    return success({
        notes: <ItemNote>{
            content,
            item_reference_id,
            type
        }
    });
}

export default createItemNoteRules;