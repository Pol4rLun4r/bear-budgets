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
    getAllQuotationsSummaryRepository
} from "./quotation.repository.js";

import {
    addItemsToQuotationVersionRepository,
    createItemReferenceRepository,
    getItemReferenceByIdRepository,
    getItemRNotesByReferenceIdRepository,
    getItemVersionByIdRepository,
    searchItemReferencesByDescriptionRepository,
    createItemNoteRepository,
    deleteAllItemReferencesRepository,
    deleteAllItemNotesByIdReference
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
        getAllSummary: getAllQuotationsSummaryRepository(db),
        
    },
    item: {
        createNote: createItemNoteRepository(db),
        createReference: createItemReferenceRepository(db),
        addToQuotation: addItemsToQuotationVersionRepository(db),
        getReferenceById: getItemReferenceByIdRepository(db),
        getVersionById: getItemVersionByIdRepository(db),
        getReferenceNotesByReferenceId: getItemRNotesByReferenceIdRepository(db),
        searchByDescription: searchItemReferencesByDescriptionRepository(db),
        deleteAllReferences: deleteAllItemReferencesRepository(db),
        deleteAllNotesByReferenceId: deleteAllItemNotesByIdReference(db),
    },
});

export type Repositories = ReturnType<typeof createRepositories>;