// mantine
import { Stack, Button } from "@mantine/core";

// redux
import type { AppDispatch } from "../../../../../redux/store";
import { useDispatch } from "react-redux";
import newClientPartial from "../../../../../redux/createBudget/searchClient/newClientParcial.thunk";

const CreateNewClientButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleNewClientPartial = () => dispatch(newClientPartial())

  return (
    <Stack >
      Nenhum cliente encontrado
      <Button variant="gradient" radius='lg' onClick={() => handleNewClientPartial()}>Criar novo cliente</Button>
    </Stack>
  )
};

export default CreateNewClientButton;