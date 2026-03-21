// redux
import type { AppDispatch } from "../store";
import { resetNewClient } from "./createClient/newClientSlice";
import { closeSteps } from "./showStepsSlice";
import { resetSearchClient } from "./searchClient/searchClientSlice";
import { resetStep } from "./stepsSlice";
import { resetBasicData } from "./drafts/quotationBasicDataSlice";
import { resetAllAddItemData } from "./items/addItemSlice";
import { resetNote } from "./newItemNoteSlice";

// limpa os dados e retorna à etapa anterior
const resetCreateBudget = () => (dispatch: AppDispatch) => {
    dispatch(resetSearchClient());
    dispatch(closeSteps());
    dispatch(resetNewClient());
    dispatch(resetStep());
    dispatch(resetBasicData());
    dispatch(resetAllAddItemData());
    dispatch(resetNote());
};

export default resetCreateBudget;