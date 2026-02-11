// react
import { useState, useEffect } from "react";

// mantine
import { Title } from "@mantine/core";
import { useForm } from "@mantine/form";

// lodash
import isEqual from "lodash/isEqual";

// components
import Content from "./Content";
import Form from "./Form";

// axios
import clientService from '../../../services/client-api';

export type ClientCategory = "Nacional" | "Internacional";

export type ClientType = {
    id: number;
    name?: string;
    document?: string;
    type_client?: ClientCategory;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

const SearchClient = () => {
    const form = useForm({
        mode: 'controlled',
        initialValues: {
            query: '',
            typeQuery: 'document'
        }
    })

    const [clients, setClients] = useState<ClientType[]>([])
    const [loading, setLoading] = useState(false)
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

        setTimeout(async () => {
            try {
                setLoading(true)
                setError(null)

                const data = {
                    value: query,
                    type: form.values.typeQuery
                }

                const response: { success: boolean, data: any[] } = await clientService.search(data)

                // Se a resposta não for um array, converter para array vazio
                const newData = Array.isArray(response.data) ? response.data : [];

                if (!isEqual(clients, newData)) {
                    setClients(newData);
                }

            } catch (err: any) {
                const errorData = err.response?.data?.data;

                console.log(errorData);
                setError(errorData);
                setClients([])
            } finally {
                setLoading(false)
            }
        }, 0)

    }, [form.values.query, form.values.typeQuery])

    return (
        <>
            <Title>Buscar Cliente</Title>
            <Form form={form} />
            <Content form={form} loading={loading} clients={clients} error={error} />
        </>
    )
}

export default SearchClient