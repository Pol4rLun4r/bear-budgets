// mantine
import { Divider, SimpleGrid, Stack } from "@mantine/core"

// redux
import { useAppSelector } from "@/app/reduxHooks"
import { getSwitchModeReferenceForm } from "../../store/itemForm.selectors"
import type { ItemFormScope } from "../../store/itemForm.slice";

// components
import Description from "./inputs/description/@Description";
import InternalCode from "./inputs/InternalCode";
import ManufacturerCode from "./inputs/ManufacturerCode";
import NCM from "./inputs/Ncm";
import Notes from "./inputs/Notes";
import Links from "./inputs/links/@Links";

const ItemReference = ({ scope }: { scope: ItemFormScope }) => {
  const switchMode = useAppSelector(getSwitchModeReferenceForm);

  return (
      <Stack gap="md">
        <Description scope={scope} />
        <SimpleGrid cols={{ base: 1, sm: switchMode ? 1 : 3 }} spacing="sm">
          <InternalCode scope={scope} />
          {!switchMode && <ManufacturerCode scope={scope} />}
          {!switchMode && <NCM scope={scope} />}
        </SimpleGrid>
        <Stack gap="md" style={{ display: switchMode ? "none" : undefined }}>
          <Divider />
          <Notes scope={scope} />
          <Links scope={scope} />
        </Stack>
      </Stack>
  )
}

export default ItemReference