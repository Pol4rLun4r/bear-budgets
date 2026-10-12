// mantine
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

// components
import BudgetForm from "../budgetForm/@BudgetForm.tsx";
import List from "./List/@List.tsx";

// react-query
import { useQuery } from "@tanstack/react-query";

// api
import services from "../../services/index.ts";

const Budgets = () => {
  const [opened, { open, close }] = useDisclosure(false);

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

  if (isPending) return 'Carregando...'

  return (
    <>
      {data!.length <= 0 ? <div>Sem orçamentos</div> :
        <>
          <List budgets={data!} open={open} />

          <Modal
            padding='xl'
            size="100%"
            opened={opened}
            onClose={close}
            title={"Informações do Orçamento"}
            centered
            radius='lg'
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 0,
            }}
          >
            {opened && <BudgetForm scope="budget_form_edit" close={close} />}
          </Modal>
        </>
      }
    </>
  )
}

export default Budgets