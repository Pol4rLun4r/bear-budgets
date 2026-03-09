// mantine
import { Group, Paper } from "@mantine/core";

// components
import DocumentInput from "./documentInput/@Document";
import NameInput from "./NameInput";
import CleanData from "./CleanData";
import CreateBudgetButton from "../createBudgetButton/@CreateBudgetButton";

const ClientData = () => {
  return (
    <Paper withBorder radius="lg" w={'100%'} p="lg">
      <Group justify="space-between" w={'100%'} align="flex-end">
        <Group align="flex-end">
          <DocumentInput />
          <NameInput />
          <CleanData />
        </Group>
        <CreateBudgetButton />
      </Group>
    </Paper>
  )
}

export default ClientData