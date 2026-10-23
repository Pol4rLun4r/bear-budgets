// types
import type { RootState } from "@/app/store";
import { ItemFormScope } from "./itemForm.slice";

// pega todo os dados do itemForm (formulário do item)
export const getItemFormState = (state: RootState, scope: ItemFormScope) =>
    state.itemForm.form[scope];
