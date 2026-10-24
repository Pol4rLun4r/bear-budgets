import React from "react";

// mantine
import { Table, TableTdProps } from "@mantine/core";

// style
import classes from "./Items.module.css"

// component
import RowContent from "@/shared/RowContent";

interface RowsType {
  references: ItemReference[];
  seeAllValues: (itemReferenceId: ItemReference['id']) => React.ReactElement
}

const Rows = ({ references, seeAllValues }: RowsType) => {

  // props padrão de cada linha da tabela
  const tableTdProps: TableTdProps = {
    className: classes.rowContainer,
    height: 40,
  }

  return (
    references.map((reference) => (
      <Table.Tr key={reference.id} data-item-reference-id={reference.id}>
        <Table.Td align="center">{seeAllValues(reference.id)}</Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.description} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.internal_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.manufacturer_code} /></Table.Td>
        <Table.Td {...tableTdProps} ><RowContent label={reference.ncm} /></Table.Td>
        <Table.Td {...tableTdProps} >{reference.created_at}</Table.Td>
        <Table.Td {...tableTdProps} >{reference.updated_at}</Table.Td>
      </Table.Tr>
    ))
  )
}

export default Rows;