// mantine
import { Select } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

// hooks
import { markupList } from "../../../../../utils/markupList";

// redux
import { RootState, AppDispatch } from "../../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { ItemFormScope, setValues } from "../../../../../redux/createBudget/items/itemFormSlice";

const Markup = ({ scope }: { scope: ItemFormScope }) => {
    const itemData = useSelector((state: RootState) => state.createBudget.itemForm[scope].values);
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
            selectFirstOptionOnDropdownOpen

            defaultValue={'40.3'}

            data={[
                { group: 'Padrão', items: markupList as any },
                { group: 'Customizado', items: ['00'] },
            ]}

            // configurações do valor do input
            value={itemData.markup}
            onChange={(value) =>
                dispatch(setValues({ scope,values: { ...itemData, markup: value as string } }))
            }
        />
    )
}

export default Markup