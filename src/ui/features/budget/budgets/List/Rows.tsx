import { memo } from "react";
import type { ReactElement } from "react";

// mantine
import { Badge, Table, Tooltip } from "@mantine/core";

// components
import DateTimeDisplay from "@/shared/DateTimeDisplay";
import { getQuotationStatusOption } from "../../quotationStatus";

// styles
import classes from "./Items.module.css";

interface RowsType {
  budgets: Quotation[],
  seeBudget: (quotationId: Quotation['id']) => ReactElement,
  openBudget: (quotationId: Quotation['id']) => void,
}

const Rows = ({ budgets, seeBudget, openBudget }: RowsType) => {

  // converte valores numéricos para formatação da moeda brasileira ($ Real)
  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    budgets.map((budget) => {
      const status = getQuotationStatusOption(budget.status);

      return (
        <Table.Tr
          key={budget.id}
          data-budget-id={budget.id}
          h={"4rem"}
          tabIndex={0}
          aria-label={`Abrir orçamento ${String(budget.id).padStart(6, "0")}`}
          className={classes.budgetRow}
          onClick={() => openBudget(budget.id)}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            openBudget(budget.id);
          }}
        >
          <Table.Td align="center">{seeBudget(budget.id)}</Table.Td>
          <Table.Td>{String(budget.id).padStart(6, "0")}</Table.Td>
          <Table.Td>
            <Badge color={status.color} variant="light" radius="sm">
              {status.label}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Tooltip
              label={<span style={{ whiteSpace: "pre-wrap" }}>{budget.notes ?? ""}</span>}
              multiline
              w={320}
              disabled={!budget.notes}
            >
              <span className={classes.note}>{budget.notes}</span>
            </Tooltip>
          </Table.Td>
          <Table.Td>{brl.format(budget.total_value)}</Table.Td>
          <Table.Td>{budget.amount}</Table.Td>
          <Table.Td><DateTimeDisplay value={budget.created_at} /></Table.Td>
          <Table.Td><DateTimeDisplay value={budget.updated_at} /></Table.Td>
        </Table.Tr>
      );
    })
  );
};

export default memo(Rows);
