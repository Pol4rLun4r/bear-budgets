// mantine
import { Table } from "@mantine/core";

// utils
import { formatDocument } from "../../../utils/formatDocument.ts";

const Rows = ({ budgets }: { budgets: QuotationSummary[] }) => {

  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    budgets.map((budget) => (
      <Table.Tr key={budget.quotation_id}>
        <Table.Td>{budget.client_name}</Table.Td>
        <Table.Td>{formatDocument(budget.client_document)}</Table.Td>
        <Table.Td>{brl.format(budget.total_value)}</Table.Td>
        <Table.Td>{budget.amount}</Table.Td>
        <Table.Td>{budget.created_at}</Table.Td>
        <Table.Td>{budget.updated_at}</Table.Td>
      </Table.Tr>
    ))
  );
};

export default Rows;