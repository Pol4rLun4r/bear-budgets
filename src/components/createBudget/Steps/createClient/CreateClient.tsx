// mantine
import { notifications } from '@mantine/notifications';

// redux
import type { RootState, AppDispatch } from "../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { incrementStep } from "../../../../redux/createBudget/stepsSlice"
import { setNewClient } from '../../../../redux/createBudget/createClient/newClientSlice';

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
            const response = await clientService.create(formData as ClientQuery);

            if (response.code === 'CLIENT_EXISTS') {
                notifications.show({
                    title: 'Cliente já existe',
                    message: 'Usando os dados do cliente já existente',
                    autoClose: 5000,
                    position: 'top-right',
                    withCloseButton: false
                },)
            }

            dispatch(setNewClient(response.data));
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