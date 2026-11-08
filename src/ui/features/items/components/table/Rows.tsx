// mantine
import { Table, TableTdProps } from "@mantine/core";

// components
import DateTimeDisplay from "@/shared/DateTimeDisplay";

// style
import classes from "./Items.module.css"

// component
import RowContent from "@/shared/RowContent/RowContent";
import HandleActionButton from "./HandleActionButton";

interface RowsProps {
  references: ItemReference[];
  openItemDetails: () => void;
}

const Rows = ({ references, openItemDetails }: RowsProps) => {

  // props padrão de cada linha da tabela
  const tableTdProps: TableTdProps = {
    className: classes.rowContainer,
  }

  return (
    references.map((reference) => (
      <Table.Tr key={reference.id} data-item-reference-id={reference.id} h="5rem">
        <Table.Td align="center">
          <HandleActionButton openItemDetails={openItemDetails} itemReferenceId={reference.id!} />
        </Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.description} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.internal_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.manufacturer_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.ncm} /></Table.Td>
        <Table.Td {...tableTdProps} ><DateTimeDisplay value={reference.created_at} /></Table.Td>
        <Table.Td {...tableTdProps} ><DateTimeDisplay value={reference.updated_at} /></Table.Td>
      </Table.Tr>
    ))
  )
}

export default Rows;