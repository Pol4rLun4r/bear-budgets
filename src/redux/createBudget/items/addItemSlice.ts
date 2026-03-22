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

export type ItemReferenceNoteType = {
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
    markup?: number | undefined;
    purchase_freight?: number | undefined;
};

export interface AddItemsDataType {
    itemBasicData: ItemReferenceType;
    notes: ItemReferenceNoteType[];
    values: ItemValues;
}

const initialState: AddItemsDataType = {
    itemBasicData: {
        id: null,
        description: '',
        internal_code: '',
        manufacturer_code: '',
        ncm: '',
    },
    notes: [],
    values: {
        unit_price: undefined,
        quantity: 1,
        ipi: undefined,
        st: undefined,
        markup: undefined,
        purchase_freight: undefined,
    }
}

const addItemSlice = createSlice({
    name: "add-items",
    initialState,
    reducers: {
        setDescription: (state, action: PayloadAction<string>) => {
            state.itemBasicData.description = action.payload;
        },
        setInternalCode: (state, action: PayloadAction<string>) => {
            state.itemBasicData.internal_code = action.payload;
        },
        setManufacturerCode: (state, action: PayloadAction<string>) => {
            state.itemBasicData.manufacturer_code = action.payload;
        },
        setNcm: (state, action: PayloadAction<string>) => {
            state.itemBasicData.ncm = action.payload;
        },
        setItemBasicData: (state, action: PayloadAction<ItemReferenceType>) => {
            state.itemBasicData = action.payload;
        },
        setNotes: (state, action: PayloadAction<ItemReferenceNoteType[]>) => {
            state.notes = action.payload;
        },
        setValues: (state, action: PayloadAction<ItemValues>) => {
            state.values = action.payload;
        },
        resetItemDescription: (state) => {
            state.itemBasicData.description = initialState.itemBasicData.description;
        },
        resetBasicItemData: (state) => {
            state.itemBasicData = initialState.itemBasicData;
            state.notes = initialState.notes;
        },
        resetAllAddItemData: (state) => {
            state.itemBasicData = initialState.itemBasicData;
            state.notes = initialState.notes;
            state.values = initialState.values;
        },
        addNote: (state, action: PayloadAction<ItemReferenceNoteType>) => {
            state.notes.push(action.payload);
        },
        removeNote: (state, action: PayloadAction<number>) => {
            state.notes.splice(action.payload, 1);
        },
    }
});

export const {
    setItemBasicData,
    setNotes,
    setValues,
    resetBasicItemData,
    resetAllAddItemData,
    resetItemDescription,
    setDescription,
    setInternalCode,
    setManufacturerCode,
    setNcm,
    addNote,
    removeNote,
} = addItemSlice.actions;

export default addItemSlice.reducer;