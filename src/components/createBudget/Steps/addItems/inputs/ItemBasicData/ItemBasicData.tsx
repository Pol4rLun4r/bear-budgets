// components
import Description from "./Description";

// mantine
import { NativeSelect, Button, Divider, Group, Paper, Stack, TextInput, Text, Center } from "@mantine/core";

const ItemBasicData = () => {
    const select = (
        <NativeSelect
            radius='lg'
            data={[
                { value: 'text', label: 'Text' },
                { value: 'link', label: 'Link' }
            ]}
            rightSectionWidth={30}
            aria-label="type"
            styles={{
                input: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: 70,
                    marginRight: -2
                }
            }}
        />
    )

    return (
        <Stack gap="md">
            <Description />
            <Group grow justify="center" align="flex-end">
                <TextInput
                    label="Código interno"
                    placeholder="(opcional)"
                    radius='lg'
                />
                <TextInput
                    label="Código do fabricante"
                    placeholder="(opcional)"
                    radius='lg'
                />
                <TextInput
                    label="NCM"
                    placeholder="(opcional)"
                    radius='lg'
                />
            </Group>
            <Paper radius={'lg'} withBorder mih={100} p='md' style={{width: '100%'}}>
                <Stack>
                    <Group display='flex' align="flex-end" justify="center">
                        <TextInput
                            label='Nova referencia'
                            radius='lg'
                            rightSection={select}
                            placeholder="(opcional)"
                            rightSectionWidth={70}
                        />
                        <Button radius='lg' variant="default" c='dimmed'>adicionar</Button>
                    </Group>
                    <Divider />
                    <Center>
                        <Text c='dimmed'>Sem referencias</Text>
                    </Center>
                </Stack>
            </Paper>
        </Stack>
    )
}

export default ItemBasicData