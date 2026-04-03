// mantine
import { ActionIcon, Menu } from "@mantine/core";

// icon
import { IconMenu3, IconTrash } from "@tabler/icons-react";

// redux
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../redux/store";
import { deleteItem } from "../../../../redux/createBudget/items/listItemsSlice";

interface MenuItemType {
  tempId: string;
}

const MenuItem = ({ tempId }: MenuItemType) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    dispatch(deleteItem(tempId));
  }

  return (
    <Menu shadow="md" width={150} withArrow offset={-1}>
      <Menu.Target>
        <ActionIcon variant="transparent">
          <IconMenu3 />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}
          onClick={() => handleDelete()}
        >
          Deletar item
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default MenuItem