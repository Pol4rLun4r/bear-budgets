import type { Database } from "better-sqlite3";

import {
    createClientRepository,
    getClientByIdRepository,
    getClientByDocumentRepository,
    searchClientsByDocumentRepository,
    searchClientsByNameRepository,
} from "./client.repository";

import {
    createQuotationRepository,
    getAllQuotationsRepository,
    getQuotationByIdRepository,
    getQuotationVersionByIdRepository,
    getAllQuotationsVersionsRepository,
    getQuotationVersionAllDataByIdRepository
} from "./quotation.repository";

import {
    addItemsToQuotationVersionRepository,
    createItemReferenceNoteRepository,
    createItemReferenceRepository,
    getItemReferenceByIdRepository,
    getItemReferenceNotesByReferenceIdRepository,
    searchItemReferencesByDescriptionRepository,
} from "./item.repository";

export const createRepositories = (db: Database) => ({
    client: {
        create: createClientRepository(db),
        getById: getClientByIdRepository(db),
        getByDocument: getClientByDocumentRepository(db),
        searchByDocument: searchClientsByDocumentRepository(db),
        searchByName: searchClientsByNameRepository(db),
    },
    quotation: {
        create: createQuotationRepository(db),
        getAll: getAllQuotationsRepository(db),
        getById: getQuotationByIdRepository(db),
        getByVersion: getQuotationVersionByIdRepository(db),
        getAllVersions: getAllQuotationsVersionsRepository(db),
        getVersionAllData: getQuotationVersionAllDataByIdRepository(db),
    },
    item: {
        addToQuotation: addItemsToQuotationVersionRepository(db),
        getReferenceById: getItemReferenceByIdRepository(db),
        getReferenceNotesByReferenceId: getItemReferenceNotesByReferenceIdRepository(db),
        searchByDescription: searchItemReferencesByDescriptionRepository(db),
        createReference: createItemReferenceRepository(db),
        createNoteReference: createItemReferenceNoteRepository(db)
    },
});

export type Repositories = ReturnType<typeof createRepositories>;