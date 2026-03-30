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

  const evenSmallerScreen = useMediaQuery('(min-width: 745px)');

  return (
    <Paper withBorder radius="lg" w={'100%'} p="lg">
      <Group justify="space-between" w={'100%'} align="flex-end">
        {!smallScreen ? (
          <>
            <Group align="flex-end" grow={!evenSmallerScreen ? true : false} >
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
            <Group align="flex-end">
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