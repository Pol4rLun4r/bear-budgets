/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// mantine
import { ActionIcon, Table, TableTdProps } from "@mantine/core"
import { useRef } from "react"

// redux
import { ItemFormState } from "@/features/budget/itemForm/store/itemForm.slice";
import { selectItemDeliveryInfo } from "@/features/budget/budgetForm/store/budgetForm.selectors";

// DragAndDrop
import { useSortable } from "@dnd-kit/react/sortable";

// icons
import { IconGripVertical } from "@tabler/icons-react";

// utils
import calcAddItem from "@/utils/calcAddItem";
import { convertMarkupValue } from "@/utils/markupList";

// components
import RowContent from "@/shared/RowContent/RowContent";

// style
import classes from './Row.module.css';
import { useAppSelector } from "@/app/reduxHooks";
import { budgetTableColumns } from "../budgetTableColumns";
import type { ReactNode } from "react";

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

interface RowProps {
    item: ItemFormState;
    index: number;
    visibleColumns: ReadonlySet<BudgetTableColumn>;
}

const Row = ({ item, index, visibleColumns }: RowProps) => {
    const dragHandleRef = useRef<HTMLButtonElement>(null)
    const { ref } = useSortable({ id: item.temp_id, index, handle: dragHandleRef })
    const tableTdProps: TableTdProps = {
        className: item.is_highlight
            ? `${classes.rowContainer} ${classes.highlighted}`
            : classes.rowContainer,
        height: 40,
    }

    const values = item.item_values;

    const calcItem = calcAddItem(values);

    const unitValue = calcItem.finalUnitValue;
    const total = calcItem.totalWithAll;

    const baseDate = new Date();
    const { deliveryDateLabel, deliveryDate, hasDeliveryDate } = useAppSelector(
        (state) => selectItemDeliveryInfo(state, item.item_values as ItemValues, baseDate)
    );

    const columnContent: Record<BudgetTableColumn, () => ReactNode> = {
        description: () => <RowContent label={item.item_reference.description} />,
        internalCode: () => <RowContent label={item.item_reference.internal_code} />,
        unitPrice: () => <RowContent onlyNumbers label={brl.format(unitValue)} />,
        quantity: () => <RowContent label={item.item_values.quantity} />,
        totalWithAdditions: () => <RowContent onlyNumbers label={brl.format(total)} />,
        shippingAndDelivery: () => (
            <RowContent
                label={deliveryDateLabel}
                value={hasDeliveryDate ? deliveryDate : ''}
            />
        ),
        markupPercentage: () => <RowContent label={convertMarkupValue(item.item_values.markup) + "%"} />,
        totalWithoutAdditions: () => <RowContent label={brl.format(calcItem.totalWithoutTaxes)} />,
        unitPriceWithoutAdditions: () => <RowContent onlyNumbers label={brl.format(unitValue)} />,
        unitMarkup: () => <RowContent label={brl.format(calcItem.markupUnitValue)} />,
        totalMarkup: () => <RowContent label={brl.format(calcItem.markupValue)} />,
        st: () => <RowContent label={brl.format(!item.item_values.st ? 0 : item.item_values.st)} />,
        ipiPercentage: () => <RowContent label={(!item.item_values.ipi ? 0 : item.item_values.ipi) + "%"} />,
        ipiValue: () => <RowContent label={brl.format(calcItem.ipiValue)} />,
        purchaseShipping: () => <RowContent label={brl.format(!item.item_values.purchase_shipping ? 0 : item.item_values.purchase_shipping)} />,
        extraValue: () => <RowContent label={brl.format(!item.item_values.extra_value ? 0 : item.item_values.extra_value)} />,
        totalWithIpiAndSt: () => <RowContent label={brl.format(calcItem.totalWithIPIandST)} />,
    };

    return (
        <Table.Tr ref={ref} data-item-id={item.temp_id}>
                <Table.Td {...tableTdProps}>
                    <div className={classes.itemPosition}>
                        <ActionIcon
                            ref={dragHandleRef}
                            className={classes.dragHandle}
                            size="sm"
                            variant="subtle"
                            color="gray"
                            aria-label="Arrastar para reordenar item"
                            title="Arrastar para reordenar item"
                        >
                            <IconGripVertical size={16} />
                        </ActionIcon>
                        <span>{item.item_values?.position! + 1}</span>
                    </div>
                </Table.Td>
                {budgetTableColumns
                    .filter(({ id }) => visibleColumns.has(id))
                    .map(({ id }) => (
                        <Table.Td key={id} {...tableTdProps}>{columnContent[id]()}</Table.Td>
                    ))}
        </Table.Tr>
    )
}

export default Row;