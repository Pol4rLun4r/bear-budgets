// mantine
import { SegmentedControl, Textarea, TextInput, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

// styles
import classes from "../CreateBudget.module.css"

// react
import { useState } from "react";

const CreateClient = () => {
  const form = useForm({
    mode: 'controlled',
    initialValues: { name: '', document: '', notes: '', typeClient: 'Nacional' },
  });

  const [submittedValues, setSubmittedValues] = useState<typeof form.values | null>(null)

  return (
    <>
      <form onSubmit={form.onSubmit(setSubmittedValues)} style={{width: '100%'}}>
        <TextInput
          {...form.getInputProps('document')}
          radius='lg'
          mt='xl'
          size="md"
          required
          label="CNPJ ou CPF"
          description="Informe o documento com ou sem pontuação"
          placeholder="00.000.000/0000-00"
        />
        <TextInput
          {...form.getInputProps('name')}
          mt='md'
          required
          radius='lg'
          size="md"
          label="Nome do cliente"
          description="Informar o nome do cliente ou um apelido"
          placeholder="Polaroid da silva"
        />
        <Text mt='md' c='dimmed' size="sm">Por padrão o cliente é nacional</Text>
        <SegmentedControl
          {...form.getInputProps('typeClient')}
          fullWidth
          radius='lg'
          size="md"
          data={['Nacional', 'Internacional']}
        />
        <Textarea
          {...form.getInputProps('notes')}
          radius='lg'
          mt="md"
          size="md"
          label="Notas"
          description="Qualquer informação que possa ser necessária"
          placeholder="Cliente frequente"
          autosize
          minRows={3}
        />
      </form>
    </>
  )
}

export default CreateClient;