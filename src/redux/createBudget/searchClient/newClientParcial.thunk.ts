// types
import type { AppDispatch, RootState } from "../../store"

// redux
import { openSteps } from "../stepsSlice"
import { setName, setDocument } from "../newClientSlice"

// define pré dados como nome ou documento ao formulário de novo cliente
const newClientPartial = () =>
    (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(openSteps());

        const { type, value } = getState().searchClient;

        if (type === 'name') {
            dispatch(setName(value));
        } else {
            dispatch(setDocument(value));
        }
    };

export default newClientPartial;