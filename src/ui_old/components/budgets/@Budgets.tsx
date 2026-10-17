// mantine
import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal } from "@mantine/core";

// components
import BudgetForm from "../budgetForm/@BudgetForm.tsx";
import List from "./List/@List.tsx";

// react-query
import { useQuery } from "@tanstack/react-query";

// api
import services from "../../services/index.ts";

// redux
import { useSelector } from "react-redux";
import budgetEditHasChanges from "../../redux/budgetForm/budgetEditHasChanges.select.ts";

const Budgets = () => {
  const [formOpened, { open: formOpen, close: formClose }] = useDisclosure(false);
  const [requestOpened, { open: requestOpen, close: requestClose }] = useDisclosure(false);

  // puxa os dados dos orçamentos
  const fetchData = async () => {
    const result = await services.quotation.getAllSummary();

    if (!result.success) {
      return [];
    }

    const data = result.data
    return data === undefined ? [] : data;
  }

  const { isPending, data } = useQuery({
    queryKey: ['budgetsData'],
    queryFn: () => fetchData().then((res) => res)
  })

  const hasChanges = useSelector(budgetEditHasChanges)

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

  if (isPending) return 'Carregando...'

  return (
    <>
      {data!.length <= 0 ? <div>Sem orçamentos</div> :
        <>
          <List budgets={data!} open={formOpen} />

          {/* modal que mostra o formulário do orçamento */}
          <Modal
            padding='xl'
            size="100%"
            opened={formOpened}
            onClose={requestCloseModal}
            title={"Informações do Orçamento"}
            centered
            radius='lg'
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 0,
            }}
          >
            <>
              <Modal
                withCloseButton={false}
                padding='xl'
                opened={requestOpened}
                onClose={requestClose}
                title={"Deseja fechar o orçamento sem salvar?"}
                centered
                radius='lg'
                overlayProps={{
                  backgroundOpacity: 0.55,
                  blur: 0,
                }}
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
        </>
      }
    </>
  )
}

export default Budgets