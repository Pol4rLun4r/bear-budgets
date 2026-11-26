import { useState } from "react";

// mantine
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

// components
import BudgetForm from "../budgetForm/@BudgetForm.tsx";
import List from "./List/@List.tsx";

// redux
import { useAppSelector } from "@/app/reduxHooks.ts";
import { useGetQuotationSummariesQuery } from "../budgetForm/store/quotation.api.ts";
import { selectBudgetEditHasChanges } from "../budgetForm/store/budgetForm.selectors.ts";

// styles
import budgetFormClasses from "../budgetForm/budgetForm.module.css";

const Budgets = () => {
  const [formOpened, { open: formOpen, close: formClose }] = useDisclosure(false);
  const [requestOpened, { open: requestOpen, close: requestClose }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const {
    data: budgets,
    error,
    isError,
    isLoading,
    refetch,
  } = useGetQuotationSummariesQuery(debouncedSearch.trim() || undefined);
  
  const hasChanges = useAppSelector(selectBudgetEditHasChanges);

  type CloseReason = "requested" | "saved";

  const continueEditing = () => {
    requestClose();
  };

  const discardChangesAndClose = () => {
    requestClose();
    formClose();
  };

  const requestCloseModal = (reason: CloseReason = "requested") => {
    if (reason === "saved") {
      requestClose();
      formClose();
      return;
    }

    if (hasChanges) {
      requestOpen();
      return;
    }

    requestClose();
    formClose();
  };

  if (isLoading) return "Carregando...";

  if (isError) {
    const errorMessage = error && "error" in error && typeof error.error === "string"
      ? error.error
      : "Ocorreu um erro desconhecido.";

    return (
      <div role="alert">
        <p>Não foi possível carregar os orçamentos: {errorMessage}</p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  const budgetList = budgets ?? [];

  return (
    <Stack w="100%" h="100%" gap="md" style={{ minWidth: 0 }}>
      <TextInput
        size="md"
        radius="lg"
        placeholder="Buscar por ID ou anotações"
        aria-label="Buscar orçamentos por ID ou anotações"
        leftSection={<IconSearch />}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />

      <List budgets={budgetList} open={formOpen} searchQuery={debouncedSearch.trim()} />

      {/* modal que mostra o formulário do orçamento */}
      <Modal
        size="100%"
        opened={formOpened}
        onClose={requestCloseModal}
        title={"Informações do Orçamento"}
        classNames={{
          content: budgetFormClasses.modalContent,
          body: budgetFormClasses.modalBody,
        }}
      >
        <>
          <Modal
            withCloseButton={false}
            opened={requestOpened}
            onClose={requestClose}
            title={"Deseja fechar o orçamento sem salvar?"}
          >
            <Group>
              <Button bg={"teal"} onClick={() => continueEditing()} >
                não, continuar editando
              </Button>
              <Button bg={"red"} onClick={() => discardChangesAndClose()}>
                sim, sair sem salvar
              </Button>
            </Group>
          </Modal>
          {formOpened && <BudgetForm scope="budget_form_edit" close={requestCloseModal} />}
        </>
      </Modal>
    </Stack>
  )
}

export default Budgets