// mantine
import { ActionIcon, Table, TableTdProps } from "@mantine/core";

// components
import RowContent from "@/shared/RowContent";

// style
import classes from '../../../../Items.module.css';

// utils
import calcAddItem from "@/utils/calcAddItem.ts";
import { convertMarkupValue } from "@/utils/markupList.ts";

// icons
import { IconEyeDollar } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks.ts";
import { setItemForm } from "@/features/budget/itemForm/store/itemForm.slice.ts";
import { selectItemDeliveryInfo } from "@/features/budget/budgetForm/store/budgetForm.selectors.ts";

const tableTdProps: TableTdProps = {
  className: classes.rowContainer,
  height: 40,
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const Row = ({ item_values, onOpenValuesModal }: { onOpenValuesModal: () => void, item_values: ItemValues }) => {
  const dispatch = useAppDispatch();

  const values = item_values;

  const calcItem = calcAddItem(values);

  const unitValue = calcItem.finalUnitValue;
  const total = calcItem.totalWithAll;

  const baseDate = new Date();
  const { deliveryDateLabel, deliveryDate, hasDeliveryDate } = useAppSelector(
    (state) => selectItemDeliveryInfo(state, item_values, baseDate)
  );


  const handleSeeValues = () => {
    dispatch(setItemForm(
      {
        scope: "item_form_edit",
        item: {
          item_reference: { description: 'test' },
          item_values: { ...values },
          reference_links: [],
          temp_id: "99999",
          toggleStMode: false,
        }
      }))
    onOpenValuesModal()
  }

  return (
    <Table.Tr >
      <Table.Td {...tableTdProps} align="center">
        <ActionIcon variant="transparent" onClick={handleSeeValues}>
          <IconEyeDollar />
        </ActionIcon>
      </Table.Td>
      <Table.Td {...tableTdProps}><RowContent onlyNumbers label={brl.format(unitValue)} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={item_values.quantity} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent onlyNumbers label={brl.format(total)} /></Table.Td>
      <Table.Td {...tableTdProps}>
        <RowContent
          label={deliveryDateLabel}
          value={hasDeliveryDate ? deliveryDate : ''}
        />
      </Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(item_values.markup) + "%"} /></Table.Td>
      <Table.Td {...tableTdProps}>{item_values.created_at}</Table.Td>
      <Table.Td {...tableTdProps}>{item_values.updated_at}</Table.Td>
    </Table.Tr>
  )
}

export default Row;