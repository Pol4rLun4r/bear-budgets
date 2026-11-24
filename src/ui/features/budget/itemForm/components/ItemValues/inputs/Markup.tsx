// mantine
import { Select } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { markupOptions } from "@/utils/markupList";
import { ItemFormScope, setValuesField } from "../../../store/itemForm.slice";

const Markup = ({ scope }: { scope: ItemFormScope }) => {
    const markup = useAppSelector((state) => state.itemForm.form[scope].item_values.markup);
    const dispatch = useAppDispatch();

    return (
        <Select
            w={'40%'}

            label="Markup"
            radius='lg'
            placeholder="00"
            withAsterisk
            leftSection={<IconPercentage size={18} />}

            searchable
            clearable
            limit={10}
            selectFirstOptionOnChange
            selectFirstOptionOnDropdownOpen
            data={markupOptions}

            // configurações do valor do input
            value={markup}
            onChange={(value) =>
                dispatch(setValuesField({ scope, key: 'markup', value: value as string }))
            }
        />
    )
}

export default Markup