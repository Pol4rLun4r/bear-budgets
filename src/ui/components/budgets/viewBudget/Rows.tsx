// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";

// utils
import calcAddItem from "../../../utils/calcAddItem.ts";
import { convertMarkupValue } from "../../../utils/markupList.ts";

// mantine
import { Table, TableTdProps } from "@mantine/core";

// components
import RowContent from "./RowContent.tsx";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const tableTdProps: TableTdProps = {
    style: { overflow: 'hidden', verticalAlign: 'middle' },
    height: 40,
}


const Rows = ({ item }: { item: QuotationDetailLine }) => {
    const switchMode = useSelector((state: RootState) => state.createBudget.listItemsSwitchMode.mode)

    const itemValues = item.item_values;
    const itemReference = item.item_reference;

    const calcItem = calcAddItem(itemValues);

    const unitValue = calcItem.finalUnitValue;
    const total = calcItem.totalWithAll;

    return (
        <Table.Tr>
            <Table.Td {...tableTdProps}>{itemValues?.position + 1}</Table.Td>
            <Table.Td {...tableTdProps}><RowContent disableCopyButton label={itemReference.description} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={brl.format(unitValue)} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={itemValues.quantity} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={brl.format(total)} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={itemReference.internal_code} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent extraText="Embarque:" label={itemValues.boarding} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(itemValues.markup) + "%"} /></Table.Td>
            {!switchMode &&
                <>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithoutTaxes)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(itemValues.unit_price as number)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupUnitValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!itemValues.st ? 0 : itemValues.st)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={(!itemValues.ipi ? 0 : itemValues.ipi) + "%"} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.ipiValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!itemValues.purchase_shipping ? 0 : itemValues.purchase_shipping)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!itemValues.extra_value ? 0 : itemValues.extra_value)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithIPIandST)} /></Table.Td>
                </>
            }
        </Table.Tr>
    )
}

export default Rows