// mantine
import { useForm } from "@mantine/form";
import { Center, Divider, Paper, Title } from "@mantine/core";

// style
import classes from './StartBudget.module.css'

// components 
import StatusInput from "./inputs/StatusInput";
import NotesInput from "./inputs/NotesInput";

interface FormDataType {
    handleSubmit: any
}

const Form = ({ handleSubmit }: FormDataType) => {

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            status: '0',
            notes: ''
        }
    })

    return (
        <form
            onSubmit={form.onSubmit(handleSubmit)}
            id="start-budget-form"
        >
            <Paper withBorder radius='md' className={classes.form} >
                <Center>
                    <Title order={4}>Informações básicas do orçamento</Title>
                </Center>
                <Divider mt={20} mb={20} />
                <StatusInput form={form} />
                <NotesInput form={form} />
            </Paper>
        </form>
    )
};

export default Form;