import { useState } from "react";

// mantine
import { ActionIcon, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// icons
import { IconReportMoney } from "@tabler/icons-react";

// redux
import { useAppDispatch } from "@/app/reduxHooks";
import { setAllItemValues } from "../../store/menu.slice";

// types
import { MenuProps } from "./@MenuItem";

// api
import services from "@/services";

const SeeAllItemValues = ({ itemReferenceId, open }: MenuProps) => {
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    const handleOpen = async () => {
        open();
        setLoading(true);

        try {
            const values = await services.item.getAllValuesByReferenceId(itemReferenceId!);

            if (!values.success) return console.log(values.data);

            const hasValues = values.data === undefined ? false : values.data === null ? false : values.data.length <= 0 ? false : true;

            dispatch(setAllItemValues(hasValues ? values.data! : []));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';

            notifications.show({
                title: 'Algo deu errado!',
                message: errorMessage,
                color: 'pink',
                position: 'bottom-right'
            })
        } finally {
            setLoading(false);
        }

    };

    return (
        <ActionIcon onClick={() => handleOpen()} variant="transparent">
            {loading ? <Loader size={16} /> : <IconReportMoney />}
        </ActionIcon>
    );
}

export default SeeAllItemValues