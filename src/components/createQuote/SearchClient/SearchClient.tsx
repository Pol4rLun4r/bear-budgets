// mantine
import { Box, SegmentedControl, Title, Text, Stack, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

// components
import SearchInput from "./SearchInput";

// styles
import classes from "./SearchClient.module.css"

// icon
import { IconSearch } from "@tabler/icons-react";

const SearchClient = () => {
    const form = useForm({
        mode: 'controlled',
        initialValues: {
            query: '',
            typeQuery: 'document'
        }
    })

    const handleQuery = () => {
        console.log(form.values);
    }

    return (
        <>
            <Title>Buscar Cliente</Title>
            <form className={classes.containerForm} onChange={handleQuery}>
                <SearchInput mt={10}
                    {...form.getInputProps('query')}
                />
                <Text mt='md' size="sm" c='dimmed'>Tipo de busca</Text>
                <SegmentedControl
                    fullWidth
                    radius='lg'
                    size="md"
                    {...form.getInputProps('typeQuery')}
                    data={[
                        { label: 'Documento', value: 'document' },
                        { label: 'Nome', value: 'name' }
                    ]}
                    defaultValue={form.values.typeQuery}
                />
            </form>
            <Box className={classes.box}>
                <Stack className={classes.nothing}>
                    <Text style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', gap: 5 }}>
                        Sem um cliente no momento, faça uma busca <IconSearch size={18} />
                    </Text>
                    <Text>OU</Text>
                    <Button variant="gradient" radius='lg'>Criar novo cliente</Button>
                </Stack>
            </Box>
        </>
    )
}

export default SearchClient