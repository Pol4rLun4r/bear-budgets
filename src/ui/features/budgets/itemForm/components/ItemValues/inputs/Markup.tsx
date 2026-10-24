// mantine
import { Select } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

// hooks
import { markupList } from "@/utils/markupList";

// redux
import { getItemFormState } from "../../../store/itemForm.selectors";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, setValuesField } from "../../../store/itemForm.slice";

const Markup = ({ scope }: { scope: ItemFormScope }) => {
    const { item_values } = useAppSelector((state) => getItemFormState(state, scope));
    const dispatch = useAppDispatch();

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

            defaultValue={'40'}

            data={[
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                { group: 'Padrão', items: markupList as any },
                { group: 'Customizado', items: ['00'] },
            ]}

            // configurações do valor do input
            value={item_values.markup}
            onChange={(value) =>
                dispatch(setValuesField({ scope, key: 'markup', value: value as string }))
            }
        />
    )
}

export default Markup