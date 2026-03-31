// mantine
import { Group, Paper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

// components
import DocumentInput from "./documentInput/@Document";
import NameInput from "./NameInput";
import CleanData from "./CleanData";
import CreateBudgetButton from "../createBudgetButton/@CreateBudgetButton";

const ClientData = () => {
  const smallScreen = useMediaQuery('(min-width: 800px)');

  return (
    <Paper withBorder radius="lg" w={'100%'} p="lg">
      <Group justify="space-between" w={'100%'} align="flex-end">
        {!smallScreen ? (
          <>
            <Group align="flex-start">
              <DocumentInput />
              <NameInput />
            </Group>
            <Group>
              <CleanData />
              <CreateBudgetButton />
            </Group>
          </>
        ) : (
          <>
            <Group align="flex-start">
              <DocumentInput />
              <NameInput />
              <CleanData />
            </Group>
            <CreateBudgetButton />
          </>
        )}
      </Group>
    </Paper>
  )
}

export default ClientData