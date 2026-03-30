import { Table, TableTdProps } from "@mantine/core"

// redux
import type { itemDataType } from "../../../../redux/createBudget/items/addItemSlice";

// utils
import calcAddItem from '../../../../utils/calcAddItem';
import { convertMarkupValue } from "../../../../utils/markupList";

// components
import RowContent from "./RowContent";

// style
import classes from './Row.module.css';

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const Row = ({ item }: { item: itemDataType }) => {
    const calcItem = calcAddItem({
        unitValue: item.values.unit_price,
        quantity: item.values.quantity,
        markup: convertMarkupValue(item.values.markup!),
        purchaseShipping: item.values.purchase_freight,
        ipi: item.values.ipi,
        st: item.values.st
    })

    const unitValue = calcItem.finalUnitValue;
    const total = calcItem.totalWithAll;

    const tableTdProps: TableTdProps = {
        className: classes.rowContainer,
        height: 40,
    }

    return (
        <Table.Tr>
            <Table.Td {...tableTdProps}><RowContent label={item.itemBasicData.description} /></Table.Td>
            <Table.Td {...tableTdProps} ><RowContent label={brl.format(unitValue)} /></Table.Td>
            <Table.Td {...tableTdProps} ><RowContent label={item.values.quantity} /></Table.Td>
            <Table.Td {...tableTdProps} ><RowContent label={brl.format(total)} /></Table.Td>
            <Table.Td {...tableTdProps} ><RowContent label={item.itemBasicData.internal_code} /></Table.Td>
            <Table.Td {...tableTdProps} ><RowContent label={brl.format(calcItem.markupUnitValue)} /></Table.Td>
            <Table.Td {...tableTdProps} ><RowContent label={brl.format(calcItem.markupValue)} /></Table.Td>
        </Table.Tr>
    )
}

export default Row