// redux
import type { AppDispatch } from "../store";
import { resetNewClient } from "./newClientSlice";
import { closeSteps } from "./stepsSlice";

// limpa os dados e retorna à etapa anterior
const resetCreateBudget = () => (dispatch: AppDispatch) => {
    dispatch(closeSteps());
    dispatch(resetNewClient());
};

export default resetCreateBudget;