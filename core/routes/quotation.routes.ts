// express
import { Router } from "express";

// types
import type { Database } from "better-sqlite3";

// controllers
import create from "../controller/quotation/createQuotation.controller";
import addItems from "../controller/item/addItemsToQuotation.controller";
import searchItemsReferences from "../controller/item/searchItemReferences.controller";
import getItemReferenceNotes from "../controller/item/getItemReferenceNotes.controller";

const quotationRoutes = (db: Database) => {
    const router = Router();

    router.post("/", create(db));
    router.post("/items", addItems(db));
    router.get("/items/reference-notes", getItemReferenceNotes(db));
    router.post("/items/search-references", searchItemsReferences(db));

    return router;
}

export default quotationRoutes;