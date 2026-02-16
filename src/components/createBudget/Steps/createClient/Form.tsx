// mantine
import { useForm } from "@mantine/form";

// react
import { useState, useEffect } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setNewClient } from "../../../../redux/createBudget/createClient/newClientSlice";

// components
import DocumentInput from "./inputs/DocumentInput";
import NameInput from "./inputs/NameInput";
import TypeClientInput from "./inputs/TypeClientInput";
import NotesInput from "./inputs/NotesInput";

// utils
import { validateDocument } from '../../../../../utils/documentValidator';

interface FormDataType {
  handleSubmit: () => Promise<void>
}

const Form = ({ handleSubmit }: FormDataType) => {
  const dispatch = useDispatch();
  const formSate = useSelector((state: RootState) => state.createBudget.newClient);

  // valores iniciais do Redux só no mount; depois o formulário sincroniza com o store
  const [initialValues] = useState(() => ({ ...formSate }));

  const form = useForm({
    mode: 'controlled',
    initialValues,

    validate: {
      document: (value) => {
        if (!value?.trim()) return 'Campo vazio';
        return validateDocument(value) ? null : 'Informe um documento válido';
      },
      name: (value) => (value!.length < 3 ? 'Nome precisa ter ao menos 3 caracteres' : null),
    }
  });

  // mantém o Redux em sync com o formulário
  useEffect(() => {
    dispatch(setNewClient(form.values));
  }, [form.values, dispatch]);

  return (
    <>
      <form
        onSubmit={form.onSubmit(() => handleSubmit())}
        style={{ width: '100%' }}
        id="create-client-form"
      >
        <DocumentInput form={form} />
        <NameInput form={form} />
        <TypeClientInput form={form} />
        <NotesInput form={form} />
      </form>
    </>
  )
};


export default Form;