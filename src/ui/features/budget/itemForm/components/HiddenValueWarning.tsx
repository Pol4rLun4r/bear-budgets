import { Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconEyeOff } from "@tabler/icons-react";
import { useAppSelector } from "@/app/reduxHooks";
import { isHiddenValueWarning } from "../store/itemForm.selectors";
import type { ItemFormScope } from "../store/itemForm.slice";
import classes from "./HiddenValueWarning.module.css";

interface HiddenValueWarningProps {
  scope: ItemFormScope;
}

const HiddenValueWarning = ({ scope }: HiddenValueWarningProps) => {
  const shouldShowWarning = useAppSelector((state) =>
    isHiddenValueWarning(state, scope)
  );

  if (!shouldShowWarning) return null;

  return (
    <Paper className={classes.warning} p="xs" radius="md" withBorder role="status">
      <Group gap="xs" wrap="nowrap">
        <ThemeIcon size={24} radius="xl" variant="light" color="violet">
          <IconEyeOff size={15} stroke={1.8} />
        </ThemeIcon>
        <Text size="sm" fw={600}>Há valores importantes ocultados</Text>
      </Group>
    </Paper>
  );
};

export default HiddenValueWarning;
