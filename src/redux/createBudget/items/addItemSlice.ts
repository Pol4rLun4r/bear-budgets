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
    unit_price: number | null;
    quantity: number;
    ipi: number | null;
    st: number | null;
    markup: number | null;
    purchase_freight: number | null;
};

export interface AddItemsDataType {
    itemBasicData: ItemReferenceType;
    notes: ItemReferenceNoteType[];
    values: ItemValues
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
        unit_price: null,
        quantity: 1,
        ipi: null,
        st: null,
        markup: null,
        purchase_freight: null,
    }
}

const addItemSlice = createSlice({
    name: "addItems",
    initialState,
    reducers: {
        setDescription: (state, action: PayloadAction<string>) => {
            state.itemBasicData.description = action.payload;
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
        resetAddItemData: () => initialState,
        resetItemDataButNotDescription: (state) => {
            state.itemBasicData = {
                ...initialState.itemBasicData,
                description: state.itemBasicData.description, // mantém a descrição
            };
            state.notes = initialState.notes;
            state.values = initialState.values;
        }
    }
});

export const {
    setItemBasicData,
    setNotes,
    setValues,
    resetAddItemData,
    setDescription,
    resetItemDataButNotDescription
} = addItemSlice.actions;

export default addItemSlice.reducer;