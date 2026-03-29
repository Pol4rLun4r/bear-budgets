// redux
import type { AppDispatch } from "../../store";
import { resetAllAddItemData } from "./addItemSlice";
import { resetStep } from "./addItemStepsSlice";

// lima os dados do formulário de acionar item
const resetAddItem = (dispatch: AppDispatch) => {
    dispatch(resetAllAddItemData());
    dispatch(resetStep());
};

export default resetAddItem;