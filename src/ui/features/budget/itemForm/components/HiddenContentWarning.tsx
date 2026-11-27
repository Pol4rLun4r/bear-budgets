import { Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconEyeOff } from "@tabler/icons-react";
import { useAppSelector } from "@/app/reduxHooks";
import {
  getStepState,
  isHiddenReferenceWarning,
  isHiddenValueWarning,
} from "../store/itemForm.selectors";
import type { ItemFormScope } from "../store/itemForm.slice";
import classes from "./HiddenContentWarning.module.css";

interface HiddenContentWarningProps {
  scope: ItemFormScope;
}

const HiddenContentWarning = ({ scope }: HiddenContentWarningProps) => {
  const step = useAppSelector((state) => getStepState(state, scope));
  const shouldShowWarning = useAppSelector((state) =>
    step === 0
      ? isHiddenReferenceWarning(state, scope)
      : isHiddenValueWarning(state, scope)
  );

  if (!shouldShowWarning) return null;

  return (
    <Paper className={classes.warning} p="xs" radius="md" withBorder role="status">
      <Group gap="xs" wrap="nowrap">
        <ThemeIcon size={24} radius="xl" variant="light" color="violet">
          <IconEyeOff size={15} stroke={1.8} />
        </ThemeIcon>
        <Text size="sm" fw={600}>
          {step === 0
            ? "Há informações importantes ocultadas"
            : "Há valores importantes ocultados"}
        </Text>
      </Group>
    </Paper>
  );
};

export default HiddenContentWarning;
