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
  const simpleModeVisibleFields = useAppSelector(
    (state) => state.settings.value?.interface.itemForm.itemReference.simpleModeVisibleFields ?? [],
  );
  const visibleFields = new Set(simpleModeVisibleFields);
  const isVisible = (field: ItemReferenceSimpleField) =>
    !switchMode || visibleFields.has(field);
  const gridFields: ItemReferenceSimpleField[] = ["internalCode", "manufacturerCode", "ncm"];
  const hasGridFields = gridFields.some(isVisible);
  const hasAdditionalFields = isVisible("notes") || isVisible("links");

  return (
      <Stack gap="md">
        <Description scope={scope} />
        {hasGridFields && (
          <SimpleGrid cols={{ base: 1, sm: switchMode ? 1 : 3 }} spacing="sm">
            {isVisible("internalCode") && <InternalCode scope={scope} />}
            {isVisible("manufacturerCode") && <ManufacturerCode scope={scope} />}
            {isVisible("ncm") && <NCM scope={scope} />}
          </SimpleGrid>
        )}
        {hasAdditionalFields && (
          <Stack gap="md">
            <Divider />
            {isVisible("notes") && <Notes scope={scope} />}
            {isVisible("links") && <Links scope={scope} />}
          </Stack>
        )}
      </Stack>
  )
}

export default ItemReference