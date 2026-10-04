import { Table, TableTdProps } from "@mantine/core";

import classes from "./Items.module.css"

// component
import RowContent from "../../budgetForm/items/List/RowContent.tsx";
import MenuItem from "./menu/@MenuItem.tsx";

const Rows = ({
  references,
  openMoreInfo,
  openVersionInfo,
}: {
  references: ItemReference[];
  openMoreInfo: () => void;
  openVersionInfo: () => void;
}) => {

  const tableTdProps: TableTdProps = {
    className: classes.rowContainer,
    height: 40,
  }

  return (
    references.map((reference) => (
      <Table.Tr key={reference.id}>
        <Table.Td align="center">
          <MenuItem
            notes={reference.notes}
            itemReferenceId={reference.id}
            openMoreInfo={openMoreInfo}
            openVersionInfo={openVersionInfo}
          />
        </Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.description} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.internal_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.manufacturer_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.ncm} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent disableCopyButton label={reference.created_at} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent disableCopyButton label={reference.updated_at} /></Table.Td>
      </Table.Tr>
    ))
  )
}

export default Rows;