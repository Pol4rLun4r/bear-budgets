// types
import type { AppDispatch } from "../../store"
import { ClientType } from "../../../../types/client";

// redux
import { openSteps } from "../showStepsSlice"
import { setNewClient } from "../createClient/newClientSlice"
import { incrementStep } from "../stepsSlice";

// iniciar uma nova cotação a partir de um cliente encontrado nas buscas
const startBudgetButton = (data: ClientType) =>
    (dispatch: AppDispatch) => {
        dispatch(setNewClient(data));
        dispatch(openSteps());
        dispatch(incrementStep());
    };

export default startBudgetButton;