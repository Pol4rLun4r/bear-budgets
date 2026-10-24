// redux
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { ItemFormState } from "@/features/budgets/itemForm/store/itemForm.slice";
import type { BudgetFormScope } from "./@rootReducer";

// utils
import { hasBudgetChanged } from "@/utils/budgetComparison";
import {
    differenceInCalendarDays,
    getDeliveryDate,
} from "@/features/budgets/itemForm/components/ItemValues/inputs/Boarding/boardingUtils";
import dayjs from "dayjs";

export const selectBudgetItems = (
    state: RootState,
    scope: BudgetFormScope,
) => state.budgetForm.itemTable[scope];

export const selectBudgetQuotation = (
    state: RootState,
    scope: BudgetFormScope,
) => state.budgetForm.quotationInfo[scope];

export const selectOriginalBudget = (state: RootState) =>
    state.budgetForm.originalBudget;

export const selectBudgetEditHasChanges = (state: RootState) => {
    const originalBudget = selectOriginalBudget(state);

    if (originalBudget === null) return false;

    return hasBudgetChanged(originalBudget, {
        quotation: selectBudgetQuotation(state, "budget_form_edit"),
        items: selectBudgetItems(state, "budget_form_edit"),
    });
};

export const selectCanSubmitBudget = (
    state: RootState,
    scope: BudgetFormScope,
) => scope === "budget_form_create"
    ? selectBudgetItems(state, scope).length > 0
    : selectBudgetEditHasChanges(state);

const selectBoardingDays = (
    _state: RootState,
    item: ItemFormState,
) => item.item_values.boarding ?? 0;

const selectDeliveryDays = (
    _state: RootState,
    item: ItemFormState,
) => item.item_values.delivery ?? 0;

const selectDeliveryBaseDate = (
    _state: RootState,
    _item: ItemFormState,
    baseDate: Date,
) => baseDate;

export const selectItemDeliveryInfo = createSelector(
    [selectBoardingDays, selectDeliveryDays, selectDeliveryBaseDate],
    (boardingDays, deliveryDays, baseDate) => {
        const targetDeliveryDate = getDeliveryDate(baseDate, boardingDays, deliveryDays);
        const totalCalendarDays = differenceInCalendarDays(baseDate, targetDeliveryDate);

        return {
            deliveryDateLabel: totalCalendarDays > 0
                ? `${totalCalendarDays} dia(s) corrido(s)`
                : "Sem embarque",
            deliveryDate: dayjs(targetDeliveryDate).format("DD/MM/YYYY"),
            hasDeliveryDate: boardingDays > 0 || deliveryDays > 0,
        };
    }
);

export const budgetEditHasChanges = selectBudgetEditHasChanges;
