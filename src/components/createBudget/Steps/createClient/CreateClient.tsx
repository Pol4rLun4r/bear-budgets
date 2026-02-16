// mantine
import { Button } from "@mantine/core"

// redux
import type { RootState, AppDispatch } from "../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { incrementStep } from "../../../../redux/createBudget/stepsSlice"

// components
import Form from "./Form"

// axios
import clientService from '../../../../services/client-api';

// types
import { ClientQuery } from "../../../../../types/client";

const CreateClient = () => {
    const dispatch = useDispatch<AppDispatch>();
    const formData = useSelector<RootState>((state) => state.createBudget.newClient);


    const handleSubmit = async () => {
        try {
            await clientService.create(formData as ClientQuery);

            dispatch(incrementStep());
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Form handleSubmit={handleSubmit} />
        </>
    )
}

export default CreateClient