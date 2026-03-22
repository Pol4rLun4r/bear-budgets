// mantine
import { Select } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";
import { markupList } from "../../../../../utils/markupList";

const Markup = () => {
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
        />
    )
}

export default Markup