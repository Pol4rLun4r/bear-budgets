import type { Database } from "better-sqlite3";

import {
    createClientRepository,
    getClientByIdRepository,
    getClientByDocumentRepository,
    searchClientsByDocumentRepository,
    searchClientsByNameRepository,
    deleteAllClientsRepository,
} from "./client.repository.js";

import {
    createQuotationRepository,
    getAllQuotationsRepository,
    getQuotationByIdRepository,
    getQuotationVersionByIdRepository,
    getAllQuotationsVersionsRepository,
    
} from "./quotation.repository.js";

import {
    addItemsToQuotationVersionRepository,
    createItemReferenceRepository,
    getItemReferenceByIdRepository,
    getItemReferenceNotesByReferenceIdRepository,
    getItemVersionByIdRepository,
    searchItemReferencesByDescriptionRepository,
} from "./item.repository.js";

export const createRepositories = (db: Database) => ({
    client: {
        create: createClientRepository(db),
        getById: getClientByIdRepository(db),
        getByDocument: getClientByDocumentRepository(db),
        searchByDocument: searchClientsByDocumentRepository(db),
        searchByName: searchClientsByNameRepository(db),
        deleteAll: deleteAllClientsRepository(db)
    },
    quotation: {
        create: createQuotationRepository(db),
        getAll: getAllQuotationsRepository(db),
        getById: getQuotationByIdRepository(db),
        getByVersionId: getQuotationVersionByIdRepository(db),
        getAllVersions: getAllQuotationsVersionsRepository(db),
        
    },
    item: {
        createReference: createItemReferenceRepository(db),
        addToQuotation: addItemsToQuotationVersionRepository(db),
        getReferenceById: getItemReferenceByIdRepository(db),
        getVersionById: getItemVersionByIdRepository(db),
        getReferenceNotesByReferenceId: getItemReferenceNotesByReferenceIdRepository(db),
        searchByDescription: searchItemReferencesByDescriptionRepository(db),
    },
});

export type Repositories = ReturnType<typeof createRepositories>;