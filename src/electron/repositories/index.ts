import type { Database } from "better-sqlite3";

import {
    addToQuotationRepository,
    deleteAllItemReferencesRepository,
    getAllItemReferencesRepository,
    getItemReferenceByIDRepository,
    getItemValuesByIDRepository,
    searchItemReferencesByDescriptionRepository,
    createItemReferenceRepository,
    getReferenceLinksByReferenceIdRepository
} from "./item.repository.js";

import {
    createQuotationRepository,
    deleteQuotationRepository,
    getAllQuotationSummaryRepository,
    getQuotationFullRepository,
    getQuotationByIdRepository
} from "./quotation.repository.js"

export const createRepositories = (db: Database) => ({
    quotation: {
        create: createQuotationRepository(db),
        deleteByID: deleteQuotationRepository(db),
        getAllSummary: getAllQuotationSummaryRepository(db),
        getComplete: getQuotationFullRepository(db),
        getById: getQuotationByIdRepository(db)
    },
    item: {
        createReference: createItemReferenceRepository(db),
        addToQuotation: addToQuotationRepository(db),
        deleteAllReferences: deleteAllItemReferencesRepository(db),
        getAllReferences: getAllItemReferencesRepository(db),
        getReferenceById: getItemReferenceByIDRepository(db),
        getValuesById: getItemValuesByIDRepository(db),
        searchDescription: searchItemReferencesByDescriptionRepository(db),
        getReferenceLinksByReferenceId: getReferenceLinksByReferenceIdRepository(db)
    },
});

export type Repositories = ReturnType<typeof createRepositories>;