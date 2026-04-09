// database
import type { Database } from "better-sqlite3";

// types
import type { addItemQuery } from "../types/item";
import type { Client, ClientQuery } from "../types/client";
import type { QuotationQuery } from "../types/quotation";

// rules
import addItemsToQuotationRules from "../domain/item/addItemQuery.rules";
import createQuotationRules from "../domain/quotation/createQuotation.rules";
import createClientRules, { cleanDocument } from "../domain/client/createClient.rules";

// utils
import { success } from "../utils/handleSuccess";

// repositories
import { createRepositories } from "../repositories/index";

//

export type QuotationPayload = {
    client: ClientQuery;
    quotation: QuotationQuery;
    items: addItemQuery[];
};

const createQuotationWithItems = (db: Database) => (payload: QuotationPayload) => {
    const repo = createRepositories(db);

    // verifica se o cliente existe baseado no id do cliente (se informado)
    const clientExistsById = repo.client.getById(payload.client.id);

    // verifica se o cliente existe baseado no documento
    const clientExistsByDocument = repo.client.getByDocument(cleanDocument(payload.client.document!));

    // validar regras para criar cliente
    const validateClient = createClientRules({
        clientExistsById,
        clientExistsByDocument,
        document: payload.client.document,
        name: payload.client.name,
        notes: payload.client.notes,
        type_client: payload.client.type_client
    });

    // client errors
    if (!validateClient.success) {
        return validateClient;
    };

    const hasClient = validateClient.code === 'CLIENT_EXISTS_BY_ID' || validateClient.code === 'CLIENT_EXISTS_BY_DOCUMENT';

    // id do cliente que será definido posteriormente
    let client_id: number

    if (hasClient) {
        // validar regras para criar cotação
        console.log("id do cliente encontrado");
        const data: Client = validateClient.data;
        client_id = data.id
    } else {
        const data: Client = validateClient.data;
        console.log("cria um cliente caso o mesmo não exista");
        // cria um cliente caso o mesmo não exista
        client_id = repo.client.create({ ...data })?.id as number
    };

    // validar regras para criar cotação
    const validadeQuotation = createQuotationRules({
        client_id,
        notes: payload.quotation.notes,
        status: payload.quotation.status,
        clientExists: client_id as any
    });

    // quotation errors
    if (!validadeQuotation.success) {
        return validadeQuotation;
    };

    // cria uma cotação e retorna o id da versão criada
    const quotationVersionId = repo.quotation.create({ ...validadeQuotation.data })

    // validar regras para criar items
    const resultItems = addItemsToQuotationRules({
        quotation_version_id: quotationVersionId,
        items: payload.items,
        quotationVersionExists: quotationVersionId as any,
    });

    // items errors
    if (!resultItems.success) {
        return resultItems;
    }

    const added = repo.item.addToQuotation(
        resultItems.data.quotation_version_id,
        resultItems.data.items
    );

    return success(added);
};

export default createQuotationWithItems;
