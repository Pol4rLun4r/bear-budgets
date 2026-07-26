// mantine
import { Menu } from "@mantine/core";

// icons
import { IconFileDescription } from "@tabler/icons-react";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { setVersion } from "../../../../redux/items/menuSlice";

// types
import { MenuProps } from "./@MenuItem";

// api
import services from "../../../../services/index";

const VersionInfo = ({ itemReferenceId, open }: MenuProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleOpen = async () => {
        const values = await services.item.getAllValuesByReferenceId(itemReferenceId!);

        if (!values.success) return console.log(values.data);

        const hasValues = values.data === undefined ? false : values.data === null ? false : values.data.length <= 0 ? false : true;

        dispatch(setVersion(hasValues ? values.data! : []));
        open();
    };

    return (
        <Menu.Item
            leftSection={<IconFileDescription size={15} />}
            onClick={() => handleOpen()}
        >
            Ver valores do item
        </Menu.Item>
    );
}

export default VersionInfo