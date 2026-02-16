// utils
import { success, failure } from "../utils/handleSuccess";
import { onlyNumbers, onlyName } from "../utils/clean";
import { validateDocument } from "../../utils/documentValidator";

// types
import type { ClientQuery } from "../../types/client";
import type { TypeClientCategory, ClientType } from "../../types/client";

interface CreateClientDataType extends ClientQuery {
    clientExists: ClientType | undefined
};

const createClientRules = ({ clientExists, document, name, notes, type_client }: CreateClientDataType) => {
    const cleanedName = onlyName(name!)
    const cleanedDocument = onlyNumbers(document!);
    const cleanedTypeClient = onlyName(type_client as string);

    // check if client exists
    if (clientExists) {
        return success(clientExists, 'CLIENT_EXISTS');
    }

    // check if name exists
    if (cleanedName.length === 0) {
        return failure('Nome é obrigatório');
    }

    // check if document exists
    if (cleanedDocument.length === 0) {
        return failure('Documento é obrigatório');
    }

    // check if document is valid
    if(!validateDocument(cleanedDocument)) {
        return failure('Informe um documento válido');
    }

    // check type
    if (type_client !== 'internacional' && type_client !== 'nacional') {
        return failure('Por favor, especifique o tipo do cliente. Internacional ou Nacional')
    }

    const data: ClientQuery = {
        name: cleanedName,
        document: cleanedDocument,
        type_client: cleanedTypeClient as TypeClientCategory,
        notes: notes?.length !== 0 ? notes : null,
    }

    return success(data);
};

export const cleanDocument = (document: string) => {
    return onlyNumbers(document);
};

export default createClientRules;

