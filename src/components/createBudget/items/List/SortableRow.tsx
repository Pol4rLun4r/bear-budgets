// mantine
import { Table, TableTdProps } from "@mantine/core"

// redux
import type { itemDataType } from "../../../../redux/createBudget/items/itemFormSlice";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

// DragAndDrop
import { useSortable } from "@dnd-kit/react/sortable";

// utils
import calcAddItem from '../../../../utils/calcAddItem';

// components
import RowContent from "./RowContent";
import MenuItem from "./MenuItem";

// style
import classes from './Row.module.css';
import { convertMarkupValue } from "../../../../utils/markupList";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const tableTdProps: TableTdProps = {
    className: classes.rowContainer,
    height: 40,
}

interface SortableRowProps {
    item: itemDataType;
    index: number;
}

const SortableRow = ({ item, index }: SortableRowProps) => {
    const { ref } = useSortable({ id: item.temp_id, index })
    const switchMode = useSelector((state: RootState) => state.createBudget.listItemsSwitchMode.mode)

    const values = item.values;

    const calcItem = calcAddItem(values);

    const unitValue = calcItem.finalUnitValue;
    const total = calcItem.totalWithAll;

    return (
        <Table.Tr ref={ref}>
            <Table.Td {...tableTdProps} align="center">
                <MenuItem item={item} />
            </Table.Td>
            <Table.Td {...tableTdProps}>{item.position + 1}</Table.Td>
            <Table.Td {...tableTdProps}><RowContent disableCopyButton label={item.item_basic_data.description} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={brl.format(unitValue)} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={item.values.quantity} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={brl.format(total)} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={item.item_basic_data.internal_code} /></Table.Td>
            <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(item.values.markup) + "%"} /></Table.Td>
            {!switchMode &&
                <>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithoutTaxes)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(item.values.unit_price as number)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupUnitValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.markupValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!item.values.st ? 0 : item.values.st)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={(!item.values.ipi ? 0 : item.values.ipi) + "%"} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.ipiValue)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(calcItem.totalWithIPIandST)} /></Table.Td>
                    <Table.Td {...tableTdProps}><RowContent label={brl.format(!item.values.purchase_shipping ? 0 : item.values.purchase_shipping)} /></Table.Td>
                </>
            }
        </Table.Tr>
    )
}

export default SortableRow;