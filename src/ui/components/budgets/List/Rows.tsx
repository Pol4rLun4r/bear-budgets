// mantine
import { Table } from "@mantine/core";

// utils
import MenuBudget from './Menu/@MenuBudget.tsx';

const Rows = ({ budgets }: { budgets: Quotation[] }) => {

  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    budgets.map((budget) => (
      <Table.Tr key={budget.id}>
        <Table.Td align="center">
          <MenuBudget quotationId={budget.id}/>
        </Table.Td>
        <Table.Td>{brl.format(budget.total_value)}</Table.Td>
        <Table.Td>{budget.amount}</Table.Td>
        <Table.Td>{budget.created_at}</Table.Td>
        <Table.Td>{budget.updated_at}</Table.Td>
      </Table.Tr>
    ))
  );
};

export default Rows;