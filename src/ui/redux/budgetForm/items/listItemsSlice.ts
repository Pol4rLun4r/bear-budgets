// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ItemDataState } from "../../itemForm/itemFormSlice";
import { BudgetFormScope } from "../@rootReducer";

export interface ListItemsSliceState {
    budget_form_create: ItemDataState[];
    budget_form_edit: ItemDataState[];
}

type ListItemInput = Omit<ItemDataState, "temp_id" | "toggleStMode">;

export const createEmptyItemsData = (): ItemDataState[] => {
    return []
};

const initialState: ListItemsSliceState = {
    budget_form_create: createEmptyItemsData(),
    budget_form_edit: createEmptyItemsData()
};

const draft = (state: ListItemsSliceState, scope: BudgetFormScope): ItemDataState[] => {
    return state[scope];
};

/** função para criar um id temporário aos items, cuja finalidade é diferenciar os itens para manipulação */
function newTemId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `item-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const listItemsSlice = createSlice({
    name: "budget-list-items",
    initialState,
    reducers: {
        addItem: (
            state: ListItemsSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ItemDataState }>
        ) => {
            const itemData = action.payload.data;
            const items = draft(state, action.payload.scope);

            items.push({
                ...itemData,
                temp_id: newTemId(),
                item_values: {
                    ...itemData.item_values,
                    position: items.length, // define a posição do item como o último índice da lista
                },
            });
        },
        reorderItems: (
            state: ListItemsSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, position: { oldIndex: number; newIndex: number } }>
        ) => {
            const items = draft(state, action.payload.scope);

            const { oldIndex, newIndex } = action.payload.position;

            if (oldIndex === newIndex) return;
            if (
                oldIndex < 0 || // index negativo
                oldIndex >= items.length || // index maior que o tamanho da lista
                newIndex < 0 || // index negativo
                newIndex >= items.length // index maior que o tamanho da lista
            ) {
                return;
            }

            const removed = items.splice(oldIndex, 1); // remove o item do oldIndex
            const moved = removed[0]; // pega o item removido
            items.splice(newIndex, 0, moved); // adiciona o item no newIndex

            // atualiza a posição de todos os itens
            items.forEach((item, index) => {
                item.item_values.position = index;
            });
        },
        deleteItem: (
            state: ListItemsSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, tempItemId: string }>
        ) => {
            const tempId = action.payload.tempItemId;
            const items = draft(state, action.payload.scope);

            const index = items.findIndex((item) => item.temp_id === tempId); // encontra o índice do item a ser deletado

            if (index !== -1) {
                items.splice(index, 1); // remove o item do estado

                // atualiza a posição de todos os itens
                items.forEach((item, index) => {
                    item.item_values.position = index;
                });
            }
        },
        editItem: (
            state: ListItemsSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ItemDataState }>
        ) => {
            const items = draft(state, action.payload.scope);
            const updatedItem = action.payload.data;

            const index = items.findIndex((item) => item.temp_id === updatedItem.temp_id); // encontra o índice do item a ser atualizado

            if (index !== -1) {
                items[index] = updatedItem; // substitui o item pelo atualizado
            }
        },
        resetList: (
            state: ListItemsSliceState,
            action: PayloadAction<BudgetFormScope>
        ) => {
            state[action.payload] = createEmptyItemsData();
        },
        setListItems: (
            state: ListItemsSliceState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ListItemInput[] }>
        ) => {
            state[action.payload.scope] = action.payload.data.map((item) => ({
                ...item,
                temp_id: newTemId(),
                toggleStMode: false,
            }));
        }
    },
});

export const { addItem, reorderItems, resetList, deleteItem, editItem, setListItems } = listItemsSlice.actions;

export default listItemsSlice.reducer;