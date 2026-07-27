// mantine
import { Table, TableTdProps } from "@mantine/core";

// redux
import { useSelector } from 'react-redux';
import { RootState } from "../../../../../redux/store.ts";

// components
import RowContent from "../../../../budgetForm/items/List/RowContent.tsx";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

// style
import classes from '../../Items.module.css';

// utils
import calcAddItem from "../../../../../utils/calcAddItem.ts";
import { convertMarkupValue } from "../../../../../utils/markupList.ts";

const tableTdProps: TableTdProps = {
  className: classes.rowContainer,
  height: 40,
}

const Row = ({ item_values }: { item_values: ItemValues }) => {
  const switchMode = useSelector((state: RootState) => state.budgetForm.listItemsSwitchMode.mode);

  const values = item_values;

  const calcItem = calcAddItem(values);

  const unitValue = calcItem.finalUnitValue;
  const total = calcItem.totalWithAll;

  return (
    <Table.Tr >
      <Table.Td {...tableTdProps}><RowContent label={brl.format(unitValue)} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={item_values.quantity} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={brl.format(total)} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent extraText="Embarque:" label={item_values.boarding} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(item_values.markup) + "%"} /></Table.Td>
      {!switchMode &&
        <>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithoutTaxes)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(item_values.unit_price as number)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupUnitValue)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupValue)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(!item_values.st ? 0 : item_values.st)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={(!item_values.ipi ? 0 : item_values.ipi) + "%"} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.ipiValue)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(!item_values.purchase_shipping ? 0 : item_values.purchase_shipping)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(!item_values.extra_value ? 0 : item_values.extra_value)} /></Table.Td>
          <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithIPIandST)} /></Table.Td>
        </>
      }
    </Table.Tr>
  )
}

export default Row