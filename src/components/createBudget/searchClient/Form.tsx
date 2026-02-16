// styles
import classes from './SearchClient.module.css'

// components
import SearchInput from './SearchInput'

// mantine
import { Text, SegmentedControl } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form';

interface FormType {
    form: UseFormReturnType<{
        query: string;
        typeQuery: string;
    }, (values: {
        query: string;
        typeQuery: string;
    }) => {
        query: string;
        typeQuery: string;
    }>
};

const Form = ({ form}: FormType) => {
    const handleEnter = () => {
        
    }

    return (
        <form className={classes.containerForm} onChange={() => handleEnter()}>
            <SearchInput mt={10}
                {...form.getInputProps('query')}
                placeholder="Digite o documento ou nome..."
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
    )
};

export default Form;