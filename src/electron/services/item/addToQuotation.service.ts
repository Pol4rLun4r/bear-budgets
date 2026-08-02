// database
import type { Database } from "better-sqlite3";

// rules
import { createRules } from "../../rules/index.js";

// utils
import { success } from "../../utils/handleSuccess.js";

// repositories
import { createRepositories } from "../../repositories/index.js";

const AddToQuotation = (db: Database) => (payload: AddToQuotationPayload) => {
    const repo = createRepositories(db);
    const rules = createRules();

    // verificar se a cotação existe
    const quotation = repo.quotation.base.getById(payload.quotation.id);

    // validar regras para criar items
    const validateItems = rules.item.createAndAdd({
        // @ts-expect-error - precisa ajustar o tipo de items no payload para ser compatível com o que a regra espera
        items: payload.items,
        quotationExists: quotation !== undefined ? true : false
    });

    // items errors
    if (!validateItems.success) {
        repo.quotation.base.deleteById({ id: quotation?.id as number }); // caso dê erro na criação dos items, deleta a cotação que foi criada
        return validateItems;
    }

    const added = repo.workFlows.addItemToQuotation(
        quotation!.id!,
        validateItems.data.items
    );

    repo.quotation.base.update({
        id: quotation!.id!,
        amount: payload.quotation.amount,
        total_value: payload.quotation.total_value
    });

    return success(added);
};

export default AddToQuotation;