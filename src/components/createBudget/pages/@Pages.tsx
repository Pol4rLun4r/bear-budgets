// mantine
import { Paper, Tabs, Avatar } from "@mantine/core"

// style
import classes from './Pages.module.css';

// icons
import { IconClipboardList, IconPencilMinus } from "@tabler/icons-react";

// Pages
import Items from "../items/@Items";

const Pages = () => {
  const iconSize = 25;

  const Amount = ({ amount }: { amount: number }) => {
    if (amount === 0 || amount === undefined) {
      return null
    }

    return (
      <Avatar size={iconSize} radius="xl">
        {amount.toString()}
      </Avatar>
    )
  };

  return (
    <Paper withBorder p="lg" w={'100%'} h={'100%'} radius="lg" mt="lg">
      <Tabs
        radius="md"
        defaultValue="items"
        classNames={{
          root: classes.root,
          panel: classes.panel,
          list: classes.list
        }}
      >
        <Tabs.List justify="center">
          <Tabs.Tab value="items" leftSection={<IconClipboardList size={iconSize} />} rightSection={<Amount amount={11} />} >
            Items
          </Tabs.Tab>
          <Tabs.Tab value="notes" leftSection={<IconPencilMinus size={iconSize} />} rightSection={<Amount amount={2} />} >
            Notas
          </Tabs.Tab>
        </Tabs.List>

        {/* páginas */}
        <Tabs.Panel value="items">
          <Items />
        </Tabs.Panel>
        <Tabs.Panel value="notes">
          Notas
        </Tabs.Panel>
      </Tabs>
    </Paper>
  )
}

export default Pages