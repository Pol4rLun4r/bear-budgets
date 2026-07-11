import type { Database } from "better-sqlite3";

import {
    addToQuotationRepository,
    deleteAllItemReferencesRepository,
    getAllItemReferencesRepository,
    getItemReferenceByIDRepository,
    getItemValuesByIDRepository,
    searchItemReferencesByDescriptionRepository,
    createItemReferenceRepository
} from "./item.repository.js";

import {
    createQuotationRepository,
    deleteQuotationRepository,
    getAllQuotationSummaryRepository
} from "./quotation.repository.js"

export const createRepositories = (db: Database) => ({
    quotation: {
        create: createQuotationRepository(db),
        deleteByID: deleteQuotationRepository(db),
        getAllSummary: getAllQuotationSummaryRepository(db)
    },
    item: {
        createReference: createItemReferenceRepository(db),
        addToQuotation: addToQuotationRepository(db),
        deleteAllReferences: deleteAllItemReferencesRepository(db),
        getAllReferences: getAllItemReferencesRepository(db),
        getReferenceById: getItemReferenceByIDRepository(db),
        getValuesById: getItemValuesByIDRepository(db),
        searchDescription: searchItemReferencesByDescriptionRepository(db)
    },
});

export type Repositories = ReturnType<typeof createRepositories>;