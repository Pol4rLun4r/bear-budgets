// types
import type { RootState } from "@/app/store";
import { ItemFormScope } from "./itemForm.slice";

// utils
import { isDefinedMarkup, isDefinedNonNegative } from "@/utils/itemFormValidation";

// pega todo os dados do itemForm (formulário do item)
export const getItemFormState = (state: RootState, scope: ItemFormScope) =>
    state.itemForm.form[scope];

export const getSwitchModeReferenceForm = (state: RootState) =>
    state.itemForm.switch.item_reference.mode;

export const getSwitchModeValuesForm = (state: RootState) =>
    state.itemForm.switch.item_values.mode;

export const getStepState = (state: RootState, scope: ItemFormScope) =>
    state.itemForm.steps[scope].step

export const isHiddenValueWarning = (state: RootState, scope: ItemFormScope) => {
    const step = state.itemForm.steps[scope].step;
    const itemValues = state.itemForm.form[scope].item_values;
    const switchMode = state.itemForm.switch.item_values.mode;

    return Boolean(itemValues.ipi || itemValues.st || itemValues.extra_value)
        && step !== 0
        && switchMode;
};

export const isHasDescription = (state: RootState, scope: ItemFormScope) => {
    return state.itemForm.form[scope].item_reference.description!.trim().length > 0;
}

export const isHasNotes = (state: RootState, scope: ItemFormScope) => {
    const notes = state.itemForm.form[scope].item_reference.notes;
    const hasNotes = notes === null ? false : notes === undefined ? false : notes?.length <= 0 ? false : true;

    return hasNotes
}

export const isCanSubmitItemForm = (state: RootState, scope: ItemFormScope) => {
    const { item_reference, item_values } = getItemFormState(state, scope);

    return (
        Boolean(item_reference.description?.trim()) &&
        isDefinedNonNegative(item_values.quantity) &&
        isDefinedMarkup(item_values.markup)
    );
};