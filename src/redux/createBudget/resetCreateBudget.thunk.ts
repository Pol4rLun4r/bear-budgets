// redux
import type { AppDispatch } from "../store";
import { resetNewClient } from "./createClient/newClientSlice";
import { closeSteps } from "./showStepsSlice";
import { resetSearchClient } from "./searchClient/searchClientSlice";
import { resetStep } from "./stepsSlice";

// limpa os dados e retorna à etapa anterior
const resetCreateBudget = () => (dispatch: AppDispatch) => {
    dispatch(resetSearchClient());
    dispatch(closeSteps());
    dispatch(resetNewClient());
    dispatch(resetStep());
};

export default resetCreateBudget;