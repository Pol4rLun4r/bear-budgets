import { useState } from "react";

// mantine
import { Accordion, Badge, Center, Group, Stack, Text, ThemeIcon } from "@mantine/core";

// redux
import { ItemFormScope } from "@/features/budget/itemForm/store/itemForm.slice.ts";
import { useAppSelector } from "@/app/reduxHooks.ts";

// styles
import classes from "./Links.module.css";

// components
import Form from "./Form.tsx";
import List from "./List.tsx";

// icons
import { IconLink } from "@tabler/icons-react";

const Links = ({ scope }: { scope: ItemFormScope }) => {
    const hasId = useAppSelector((state) => state.itemForm.form[scope]?.item_reference?.id);
    const links = useAppSelector((state) => state.itemForm.form[scope]?.reference_links);
    const [opened, setOpened] = useState(false);

    const linksContent = (
        <Stack gap="sm">
            {links.length > 0 ? (
                <List links={links} scope={scope} />
            ) : (
                <Center>
                    <Text size="sm" c="dimmed" ta="center" py="xs">
                        Sem links de referencia/preço
                    </Text>
                </Center>
            )}
            {hasId ? null : <Form scope={scope} />}
        </Stack>
    );

    const linkIcon = (
        <ThemeIcon
            size="md"
            radius="xl"
            variant="light"
            color={links.length > 0 ? "violet" : "gray"}
        >
            <IconLink size={16} />
        </ThemeIcon>
    );

    const linkLabel = (
        <Group gap="xs">
            <Text fw={500}>Links de referência</Text>
            <Badge
                size="sm"
                variant="light"
                color={links.length > 0 ? "violet" : "gray"}
            >
                {links.length}
            </Badge>
        </Group>
    );

    return (
        <Accordion
            variant="separated"
            radius="lg"
            value={opened ? "reference-links" : null}
            onChange={(value) => setOpened(value === "reference-links")}
            classNames={classes}
        >
            <Accordion.Item value="reference-links">
                <Accordion.Control icon={linkIcon}>{linkLabel}</Accordion.Control>
                <Accordion.Panel>
                    {linksContent}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}

export default Links