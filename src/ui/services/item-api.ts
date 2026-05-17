// api
import { baseAPI } from "./path";

const searchDescription = async (query: SearchItemDescription) => {
    const response = await baseAPI.item.searchDescription(query);
    return response;
};

const getNotes = async (item_reference_id: GetItemNotes) => {
    const response = await baseAPI.item.getNotes(item_reference_id);
    return response
};

const getReferenceLinks = async (item_reference_id: GetReferenceLinks) => {
    const response = await baseAPI.item.getReferenceLinks(item_reference_id);
    return response;
};

const createNote = async (note: CreateItemNote) => {
    const response = await baseAPI.item.createNote(note);
    return response
};

export default { searchDescription, getNotes, getReferenceLinks, createNote };