// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ItemDataState {
    temp_id: string;
    item_reference: Partial<ItemReference>;
    item_version: Partial<ItemVersion>;
    notes: Partial<ItemNote>[];
}

export type ItemFormScope = "add" | "edit";

export const ITEM_FORM_ADD: ItemFormScope = "add";
export const ITEM_FORM_EDIT: ItemFormScope = "edit";

export interface ItemFormSliceState {
    add: ItemDataState;
    edit: ItemDataState;
}

export const createEmptyItemData = (): ItemDataState => {
    return {
        temp_id: "",
        item_reference: {
            id: undefined,
            description: "",
            internal_code: "",
            manufacturer_code: "",
            ncm: "",
        },
        notes: [],
        item_version: {
            unit_price: undefined,
            quantity: 1,
            ipi: undefined,
            st: undefined,
            markup: "40.3",
            purchase_shipping: undefined,
        },
    };
};

const initialState: ItemFormSliceState = {
    add: createEmptyItemData(),
    edit: createEmptyItemData(),
};

const draft = (state: ItemFormSliceState, scope: ItemFormScope): ItemDataState => {
    return state[scope];
};

const itemFormSlice = createSlice({
    name: "item-form",
    initialState,
    reducers: {
        setDescription: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; value: string }>,
        ) => {
            draft(state, action.payload.scope).item_reference.description = action.payload.value;
        },
        setInternalCode: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; value: string }>,
        ) => {
            draft(state, action.payload.scope).item_reference.internal_code = action.payload.value;
        },
        setManufacturerCode: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; value: string }>,
        ) => {
            draft(state, action.payload.scope).item_reference.manufacturer_code = action.payload.value;
        },
        setNcm: (state, action: PayloadAction<{ scope: ItemFormScope; value: string }>) => {
            draft(state, action.payload.scope).item_reference.ncm = action.payload.value;
        },
        setItemReference: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; data: Partial<ItemReference> }>,
        ) => {
            draft(state, action.payload.scope).item_reference = action.payload.data;
        },
        setNotes: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; notes: Partial<ItemNote>[] }>,
        ) => {
            draft(state, action.payload.scope).notes = action.payload.notes;
        },
        setVersion: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; version: Partial<ItemVersion> }>,
        ) => {
            draft(state, action.payload.scope).item_version = action.payload.version;
        },
        setItemDataEdit: (
            state,
            action: PayloadAction<ItemDataState>,
        ) => {
            state.edit = action.payload;
        },
        resetItemVersion: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            const values = draft(state, action.payload).item_version;
            values.unit_price = empty.item_version.unit_price;
            values.quantity = 1;
            values.ipi = empty.item_version.ipi;
            values.st = empty.item_version.st;
            values.markup = empty.item_version.markup;
            values.purchase_shipping = empty.item_version.purchase_shipping;
        },
        resetItemDescription: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            const item = draft(state, action.payload).item_reference;
            item.description = empty.item_reference.description;
        },
        resetItemReference: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            const item = draft(state, action.payload);
            item.item_reference = empty.item_reference;
            item.notes = empty.notes;
        },
        resetItemData: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            state[action.payload] = empty;
        },
        addNote: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; note: Partial<ItemNote> }>,
        ) => {
            draft(state, action.payload.scope).notes.push(action.payload.note);
        },
        removeNote: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; index: number }>,
        ) => {
            draft(state, action.payload.scope).notes.splice(action.payload.index, 1);
        },
    },
});

export const {
    setItemReference,
    setNotes,
    setVersion,
    resetItemReference,
    resetItemData,
    resetItemDescription,
    resetItemVersion,
    setDescription,
    setInternalCode,
    setManufacturerCode,
    setNcm,
    addNote,
    removeNote,
    setItemDataEdit
} = itemFormSlice.actions;

export default itemFormSlice.reducer;