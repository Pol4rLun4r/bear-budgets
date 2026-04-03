// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { itemDataType } from "./addItemSlice";

const initialState: itemDataType[] = [];

function newTemId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `item-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const listItemsSlice = createSlice({
    name: "list-items",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<itemDataType>) => {
            state.push({
                ...action.payload,
                tempId: newTemId(),
                position: state.length,
            });
        },
        reorderItems: (
            state,
            action: PayloadAction<{ oldIndex: number; newIndex: number }>
        ) => {
            const { oldIndex, newIndex } = action.payload;

            if (oldIndex === newIndex) return;
            if (
                oldIndex < 0 || // index negativo
                oldIndex >= state.length || // index maior que o tamanho da lista
                newIndex < 0 || // index negativo
                newIndex >= state.length // index maior que o tamanho da lista
            ) {
                return;
            }

            const removed = state.splice(oldIndex, 1); // remove o item do oldIndex
            const moved = removed[0]; // pega o item removido
            state.splice(newIndex, 0, moved); // adiciona o item no newIndex

            // atualiza a posição de todos os itens
            state.forEach((item, index) => {
                item.position = index;
            });
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            const tempId = action.payload;
            const index = state.findIndex((item) => item.tempId === tempId); // encontra o índice do item a ser deletado

            if (index !== -1) {
                state.splice(index, 1); // remove o item do estado

                // atualiza a posição de todos os itens
                state.forEach((item, index) => {
                    item.position = index;
                });
            }
        },
        resetList: () => initialState,
    },
});

export const { addItem, reorderItems, resetList, deleteItem } = listItemsSlice.actions;

export default listItemsSlice.reducer;