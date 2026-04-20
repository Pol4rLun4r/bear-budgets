// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
export type ItemReferenceType = {
    id?: number | null;
    description: string;
    internal_code?: string | null;
    manufacturer_code?: string | null;
    ncm?: string | null;
};

export type ItemNoteType = {
    id?: number | null;
    item_reference_id?: number | null;
    type: "text" | "link";
    content: string;
};

export type ItemValues = {
    unit_price?: number | undefined;
    quantity?: number | undefined;
    ipi?: number | undefined;
    st?: number | undefined;
    markup?: string | undefined;
    purchase_shipping?: number | undefined;
};

export interface itemDataType {
    temp_id: string;
    position: number;
    item_basic_data: ItemReferenceType;
    notes: ItemNoteType[];
    values: ItemValues;
}

export type ItemFormScope = "add" | "edit";

export const ITEM_FORM_ADD: ItemFormScope = "add";
export const ITEM_FORM_EDIT: ItemFormScope = "edit";

export interface ItemFormSliceState {
    add: itemDataType;
    edit: itemDataType;
}

export const createEmptyItemData = (): itemDataType => {
    return {
        temp_id: "",
        position: 0,
        item_basic_data: {
            id: null,
            description: "",
            internal_code: "",
            manufacturer_code: "",
            ncm: "",
        },
        notes: [],
        values: {
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

const draft = (state: ItemFormSliceState, scope: ItemFormScope): itemDataType => {
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
            draft(state, action.payload.scope).item_basic_data.description = action.payload.value;
        },
        setInternalCode: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; value: string }>,
        ) => {
            draft(state, action.payload.scope).item_basic_data.internal_code = action.payload.value;
        },
        setManufacturerCode: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; value: string }>,
        ) => {
            draft(state, action.payload.scope).item_basic_data.manufacturer_code = action.payload.value;
        },
        setNcm: (state, action: PayloadAction<{ scope: ItemFormScope; value: string }>) => {
            draft(state, action.payload.scope).item_basic_data.ncm = action.payload.value;
        },
        setItemBasicData: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; data: ItemReferenceType }>,
        ) => {
            draft(state, action.payload.scope).item_basic_data = action.payload.data;
        },
        setNotes: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; notes: ItemNoteType[] }>,
        ) => {
            draft(state, action.payload.scope).notes = action.payload.notes;
        },
        setValues: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; values: ItemValues }>,
        ) => {
            draft(state, action.payload.scope).values = action.payload.values;
        },
        setItemDataEdit: (
            state,
            action: PayloadAction<itemDataType>,
        ) => {
            state.edit = action.payload;
        },
        resetItemValues: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            const values = draft(state, action.payload).values;
            values.unit_price = empty.values.unit_price;
            values.quantity = 1;
            values.ipi = empty.values.ipi;
            values.st = empty.values.st;
            values.markup = empty.values.markup;
            values.purchase_shipping = empty.values.purchase_shipping;
        },
        resetItemDescription: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            const item = draft(state, action.payload).item_basic_data;
            item.description = empty.item_basic_data.description;
        },
        resetBasicItemData: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            const item = draft(state, action.payload);
            item.item_basic_data = empty.item_basic_data;
            item.notes = empty.notes;
        },
        resetItemData: (state, action: PayloadAction<ItemFormScope>) => {
            const empty = createEmptyItemData();
            state[action.payload] = empty;
        },
        addNote: (
            state,
            action: PayloadAction<{ scope: ItemFormScope; note: ItemNoteType }>,
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
    setItemBasicData,
    setNotes,
    setValues,
    resetBasicItemData,
    resetItemData,
    resetItemDescription,
    resetItemValues,
    setDescription,
    setInternalCode,
    setManufacturerCode,
    setNcm,
    addNote,
    removeNote,
    setItemDataEdit
} = itemFormSlice.actions;

export default itemFormSlice.reducer;