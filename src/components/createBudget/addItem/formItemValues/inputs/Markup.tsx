// mantine
import { Select } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

// hooks
import { markupList } from "../../../../../utils/markupList";

// redux
import { RootState, AppDispatch } from "../../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { setValues } from "../../../../../redux/createBudget/items/addItemSlice";

const Markup = () => {
    const itemData = useSelector((state: RootState) => state.createBudget.addItem.values);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Select
            w={'45%'}

            label="Markup"
            radius='lg'
            placeholder="00"
            withAsterisk
            leftSection={<IconPercentage size={18} />}

            searchable
            clearable
            selectFirstOptionOnChange

            data={[
                { group: 'Padrão', items: markupList as any },
                { group: 'Customizado', items: ['00'] },
            ]}

            // configurações do valor do input
            value={itemData.markup}
            onChange={(value) => dispatch(setValues({ ...itemData, markup: value as string }))}
        />
    )
}

export default Markup