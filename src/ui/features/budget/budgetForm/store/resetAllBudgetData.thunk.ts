// redux resets
import { resetItemForm } from "../../itemForm/store/itemForm.slice.ts";
import { resetStep } from "../../itemForm/store/steps.slice.ts";
import { resetReferenceLink } from "../../itemForm/store/linkForm.slice.ts";
import { resetTable, setTagEditingEnabled } from "./itemTable.slice.ts";
import { resetQuotation, setStatus } from "./quotationInfo.slice.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export const resetAllBudgetData = createAsyncThunk<void, void, { state: RootState }>(
    "budgets/resetAllBudgetData",
    (_: void, { dispatch, getState }) => {
        const defaultTagEditingEnabled = getState().settings.value
            ?.interface.budgetTable.defaultTagEditingEnabled ?? true;
        const defaultQuotationStatus = getState().settings.value
            ?.interface.budgetTable.defaultQuotationStatus ?? 0;

        dispatch(resetItemForm("item_form_add"));
        dispatch(resetItemForm("item_form_edit"));
        dispatch(resetStep("item_form_add"));
        dispatch(resetStep("item_form_edit"));
        dispatch(resetReferenceLink("item_form_add"));
        dispatch(resetReferenceLink("item_form_edit"));
        dispatch(resetTable("budget_form_create"));
        dispatch(setTagEditingEnabled({
            scope: "budget_form_create",
            enabled: defaultTagEditingEnabled,
        }));
        dispatch(resetQuotation("budget_form_create"));
        dispatch(setStatus({
            scope: "budget_form_create",
            data: defaultQuotationStatus,
        }));
    },
);