import dayjs from "dayjs";

// mantine
import { ActionIcon, Table, TableTdProps } from "@mantine/core";

// components
import RowContent from "../../../../../budgetForm/items/List/RowContent.tsx";

// style
import classes from '../../../Items.module.css';

// utils
import calcAddItem from "../../../../../../utils/calcAddItem.ts";
import { convertMarkupValue } from "../../../../../../utils/markupList.ts";
import { addCalendarDays } from "../../../../../itemForm/formItemValues/inputs/Boarding/boardingUtils.ts";

// icons
import { IconReportMoney } from "@tabler/icons-react";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../../redux/store.ts";
import { setItemDataEditScope } from "../../../../../../redux/itemForm/itemFormSlice.ts";

const tableTdProps: TableTdProps = {
  className: classes.rowContainer,
  height: 40,
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const Row = ({ item_values, onOpenValuesModal }: { onOpenValuesModal: () => void, item_values: ItemValues }) => {
  const values = item_values;

  const calcItem = calcAddItem(values);

  const unitValue = calcItem.finalUnitValue;
  const total = calcItem.totalWithAll;

  const baseDate = new Date();
  const boardingValue = item_values.boarding ?? 0;
  const boardingLabel = boardingValue > 0 ? `${boardingValue} dia(s) corrido(s)` : 'Sem embarque';
  const boardingDate = dayjs(addCalendarDays(baseDate, boardingValue)).format('DD/MM/YYYY');

  const dispatch = useDispatch<AppDispatch>();

  const handleSeeValues = () => {
    dispatch(setItemDataEditScope({
      item_reference: { description: 'test' },
      item_values: { ...values },
      reference_links: [],
      temp_id: "99999",
      toggleStMode: false,
    }))
    onOpenValuesModal()
  }

  return (
    <Table.Tr >
      <Table.Td {...tableTdProps} align="center">
        <ActionIcon variant="transparent" onClick={handleSeeValues}>
          <IconReportMoney />
        </ActionIcon>
      </Table.Td>
      <Table.Td {...tableTdProps}><RowContent onlyNumbers label={brl.format(unitValue)} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={item_values.quantity} /></Table.Td>
      <Table.Td {...tableTdProps}><RowContent onlyNumbers label={brl.format(total)} /></Table.Td>
      <Table.Td {...tableTdProps}>
        <RowContent
          label={boardingLabel}
          value={boardingValue > 0 ? boardingDate : ''}
        />
      </Table.Td>
      <Table.Td {...tableTdProps}><RowContent label={convertMarkupValue(item_values.markup) + "%"} /></Table.Td>
      <Table.Td {...tableTdProps}>{item_values.created_at}</Table.Td>
      <Table.Td {...tableTdProps}>{item_values.updated_at}</Table.Td>
    </Table.Tr>
  )
}

export default Row;