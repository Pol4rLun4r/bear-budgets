// react
import { useState, useEffect } from "react";

// mantine
import { Title } from "@mantine/core";
import { useForm } from "@mantine/form";

// lodash
import isEqual from "lodash/isEqual";

// components
import Content from "./Content/Content";
import Form from "./Form";

// type
import { ClientType } from "../../../../types/client";

// axios
import clientService from '../../../services/client-api';

// redux
import type { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { setSearchClient } from "../../../redux/createBudget/searchClient/searchClientSlice";

const SearchClient = () => {
    const dispatch = useDispatch<AppDispatch>();

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            query: '',
            typeQuery: 'document'
        }
    })

    const [clients, setClients] = useState<ClientType[]>([])
    const [error, setError] = useState<string | null>(null)

    // Fetch com debounce
    useEffect(() => {
        const query = form.values.query.trim()

        // Se não houver query, limpar resultados
        if (query.length === 0) {
            setClients([])
            setError(null)
            return
        }

        const fetchData = async () => {
            try {
                const data = {
                    value: query,
                    type: form.values.typeQuery as 'document' | 'name'
                }

                dispatch(setSearchClient(data));

                const response: { success: boolean, data: any[] } = await clientService.search(data)

                // Se a resposta não for um array, converter para array vazio
                const newData = Array.isArray(response.data) ? response.data : [];

                if (!isEqual(clients, newData)) {
                    setClients(newData);
                }

                setError(null);
            } catch (err: any) {
                const errorData = err.response?.data?.data;

                if (!(error === errorData)) {
                    setError(errorData);
                    setClients([])
                }
            };
        };

        fetchData();

    }, [form.values.query, form.values.typeQuery])

    return (
        <>
            <Title>Buscar Cliente</Title>
            <Form form={form} />
            <Content form={form} clients={clients} error={error} />
        </>
    )
};

export default SearchClient;