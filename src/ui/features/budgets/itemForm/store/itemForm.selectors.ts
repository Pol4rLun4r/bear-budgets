// types
import type { RootState } from "@/app/store";
import { ItemFormScope } from "./itemForm.slice";

// pega todo os dados do itemForm (formulário do item)
export const getItemFormState = (state: RootState, scope: ItemFormScope) =>
    state.itemForm.form[scope];

export const getSwitchModeReferenceForm = (state: RootState) =>
    state.itemForm.switch.item_reference.mode;

export const getSwitchModeValuesForm = (state: RootState) =>
    state.itemForm.switch.item_values.mode;

export const isHiddenValueWarning = (state: RootState, scope: ItemFormScope) => {
    const step = state.itemForm.steps[scope].step;
    const itemValues = state.itemForm.form[scope].item_values;
    const switchMode = state.itemForm.switch.item_values.mode;

    return Boolean(itemValues.ipi || itemValues.st || itemValues.extra_value)
        && step !== 0
        && switchMode;
};

export const isHasNotes = (state: RootState, scope: ItemFormScope) => {
    const notes = state.itemForm.form[scope].item_reference.notes;
    const hasNotes = notes === null ? false : notes === undefined ? false : notes?.length <= 0 ? false : true;

    return hasNotes
}