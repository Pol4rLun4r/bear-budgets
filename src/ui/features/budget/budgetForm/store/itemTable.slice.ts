// redux
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ItemFormState } from "../../itemForm/store/itemForm.slice";
import { BudgetFormScope } from "./@rootReducer";
import calcAddItem from "../../../../utils/calcAddItem";

export interface ItemTableState {
    budget_form_create: ItemFormState[];
    budget_form_edit: ItemFormState[];
    tagEditingEnabled: Record<BudgetFormScope, boolean>;
}

type ItemTableInput = Omit<ItemFormState, "temp_id" | "toggleStMode" | "is_highlight"> & {
    is_highlight?: boolean;
};

export type ItemTagTarget = "all" | "neutral" | "green" | "yellow" | "red";

const itemTagTargetTags: Record<Exclude<ItemTagTarget, "all">, ItemValueTag> = {
    neutral: 0,
    green: 1,
    yellow: 2,
    red: 3,
};

export const matchesItemTagTarget = (
    item: ItemFormState,
    target: ItemTagTarget,
) => target === "all"
    || (item.item_values.tag ?? 0) === itemTagTargetTags[target];

export const getItemFreightDistributionBase = (item: ItemFormState) => {
    const finalTotal = calcAddItem(item.item_values).totalWithAll;
    return Number.isFinite(finalTotal) ? Math.max(0, finalTotal) : 0;
};

export const createEmptyItemsData = (): ItemFormState[] => {
    return []
};

const initialState: ItemTableState = {
    budget_form_create: createEmptyItemsData(),
    budget_form_edit: createEmptyItemsData(),
    tagEditingEnabled: {
        budget_form_create: false,
        budget_form_edit: false,
    },
};

const draft = (state: ItemTableState, scope: BudgetFormScope): ItemFormState[] => {
    return state[scope];
};

/** função para criar um id temporário aos items, cuja finalidade é diferenciar os itens para manipulação */
function newTemId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `item-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const itemTableSlice = createSlice({
    name: "budget-item-table",
    initialState,
    reducers: {
        addItem: (
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ItemFormState }>
        ) => {
            const itemData = action.payload.data;
            const { scope } = action.payload;
            const items = draft(state, scope);
            const tempId = newTemId();

            items.push({
                ...itemData,
                temp_id: tempId,
                is_highlight: false,
                quotation_link_id: undefined,
                item_values: {
                    ...itemData.item_values,
                    id: undefined,
                    item_reference_id: undefined,
                    created_at: undefined,
                    tag: 0,
                    position: items.length, // define a posição do item como o último índice da lista
                },
            });
        },
        reorderItems: (
            state: ItemTableState,
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
            state: ItemTableState,
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
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ItemFormState }>
        ) => {
            const items = draft(state, action.payload.scope);
            const updatedItem = action.payload.data;

            const index = items.findIndex((item) => item.temp_id === updatedItem.temp_id); // encontra o índice do item a ser atualizado

            if (index !== -1) {
                const currentTag = items[index].item_values.tag ?? 0;
                items[index] = updatedItem; // substitui o item pelo atualizado
                items[index].item_values.tag ??= currentTag;
            }
        },
        resetTable: (
            state: ItemTableState,
            action: PayloadAction<BudgetFormScope>
        ) => {
            state[action.payload] = createEmptyItemsData();
            state.tagEditingEnabled[action.payload] = false;
        },
        setItemTable: (
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope, data: ItemTableInput[] }>
        ) => {
            const items = action.payload.data.map((item) => ({
                ...item,
                temp_id: newTemId(),
                toggleStMode: false,
                is_highlight: item.is_highlight ?? false,
                item_values: {
                    ...item.item_values,
                    tag: item.item_values.tag ?? 0,
                },
            }));
            state[action.payload.scope] = items;
        },
        setTagEditingEnabled: (
            state: ItemTableState,
            action: PayloadAction<{ scope: BudgetFormScope; enabled: boolean }>,
        ) => {
            state.tagEditingEnabled[action.payload.scope] = action.payload.enabled;
        },
        setItemTag: (
            state: ItemTableState,
            action: PayloadAction<{
                scope: BudgetFormScope;
                itemId: string;
                tag: ItemValueTag;
            }>,
        ) => {
            const { scope, itemId, tag } = action.payload;
            const item = draft(state, scope).find((current) => current.temp_id === itemId);
            if (item) item.item_values.tag = tag;
        },
        cycleAllItemTags: (
            state: ItemTableState,
            action: PayloadAction<BudgetFormScope>,
        ) => {
            const scope = action.payload;

            for (const item of draft(state, scope)) {
                const currentTag = item.item_values.tag ?? 0;
                item.item_values.tag = (
                    currentTag === 3 ? 0 : (currentTag + 1) as ItemValueTag
                );
            }
        },
        resetItemTags: (
            state: ItemTableState,
            action: PayloadAction<BudgetFormScope>,
        ) => {
            const scope = action.payload;

            for (const item of draft(state, scope)) {
                item.item_values.tag = 0;
            }
        },
        dilutePurchaseShipping: (
            state: ItemTableState,
            action: PayloadAction<{
                scope: BudgetFormScope;
                amount: number;
                target: ItemTagTarget;
            }>,
        ) => {
            const { scope, amount, target } = action.payload;
            if (!Number.isFinite(amount) || amount <= 0) return;

            const items = draft(state, scope).filter((item) =>
                matchesItemTagTarget(item, target),
            );
            if (items.length === 0) return;

            const totalCents = Math.round(amount * 100);
            if (!Number.isSafeInteger(totalCents) || totalCents <= 0) return;

            const itemWeights = items.map(getItemFreightDistributionBase);
            const totalWeight = itemWeights.reduce((sum, weight) => sum + weight, 0);
            if (!Number.isFinite(totalWeight) || totalWeight <= 0) return;

            const allocations = itemWeights.map((weight, index) => {
                const exactCents = totalCents * weight / totalWeight;
                const cents = Math.floor(exactCents);

                return { index, cents, remainder: exactCents - cents };
            });
            const remainingCents = totalCents
                - allocations.reduce((sum, allocation) => sum + allocation.cents, 0);

            [...allocations]
                .sort((left, right) => right.remainder - left.remainder)
                .slice(0, remainingCents)
                .forEach(({ index }) => {
                    allocations[index].cents += 1;
                });

            allocations.forEach(({ index, cents }) => {
                items[index].item_values.purchase_shipping = cents / 100;
            });
        },
        replaceItemMarkup: (
            state: ItemTableState,
            action: PayloadAction<{
                scope: BudgetFormScope;
                markup: string;
                target: ItemTagTarget;
            }>,
        ) => {
            const { scope, markup, target } = action.payload;
            const markupValue = Number(markup);
            if (
                markup.trim() === ""
                || !Number.isInteger(markupValue)
                || markupValue < 0
                || markupValue > 1000
            ) return;

            for (const item of draft(state, scope)) {
                if (matchesItemTagTarget(item, target)) {
                    item.item_values.markup = markup;
                }
            }
        },
        applyItemDiscount: (
            state: ItemTableState,
            action: PayloadAction<{
                scope: BudgetFormScope;
                value: number;
                type: ItemDiscountType;
                target: ItemTagTarget;
            }>,
        ) => {
            const { scope, value, type, target } = action.payload;
            if (
                !Number.isFinite(value)
                || value <= 0
                || Math.abs(value * 100 - Math.round(value * 100))
                    > Number.EPSILON * Math.max(1, Math.abs(value * 100)) * 4
                || (type !== "fixed" && type !== "percentage")
            ) return;

            for (const item of draft(state, scope)) {
                if (matchesItemTagTarget(item, target)) {
                    item.item_values.discount_value = value;
                    item.item_values.discount_type = type;
                }
            }
        },
    },
});

export const {
    addItem,
    reorderItems,
    resetTable,
    deleteItem,
    editItem,
    setItemTable,
    setTagEditingEnabled,
    setItemTag,
    cycleAllItemTags,
    resetItemTags,
    dilutePurchaseShipping,
    replaceItemMarkup,
    applyItemDiscount,
} = itemTableSlice.actions;

export default itemTableSlice.reducer;