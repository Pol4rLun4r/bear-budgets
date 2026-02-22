// mantine
import { Center, Group, Paper, ThemeIcon, Title, Text, CopyButton, Tooltip, ActionIcon, MantineStyleProp, HoverCard } from '@mantine/core';

// style
import classes from './StartBudget.module.css';

// icon
import { IconUser, IconCopy, IconCheck } from "@tabler/icons-react";

// redux
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

//type
import { newClientClientDataType } from "../../../../redux/createBudget/createClient/newClientSlice";

// utils
import { formatDocument } from '../../../../utils/formatDocument';

const CopyButtonFactory = ({ value }: { value: string }) => {
    return (
        <CopyButton value={value} timeout={2000}>
            {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copiado' : 'Copiar'} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy color='gray' size={16} />}
                    </ActionIcon>
                </Tooltip>
            )}
        </CopyButton>
    )
};

const ClientInfo = () => {
    const clientData = useSelector<RootState>((state) => state.createBudget.newClient) as newClientClientDataType;

    const name = clientData.name!;
    const document = formatDocument(clientData.document!);

    const style: MantineStyleProp = {
        display: "flex", gap: 5, justifyContent: 'center', alignItems: 'center',
    }

    return (
        <HoverCard shadow='md' radius={'md'}>
            <HoverCard.Target>
                <Paper withBorder radius='md' className={classes.client}>
                    <Center style={{ flexDirection: 'row', gap: 10 }} >
                        <ThemeIcon size={30} radius={50} className={classes.clientIcon}>
                            <IconUser size={20} stroke={1.5} />
                        </ThemeIcon>
                        <Title order={4}>Informações do cliente</Title>
                    </Center>
                </Paper>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Group justify="space-around">
                    <div style={{ ...style }} >
                        Nome: <Text c="dimmed" tt='capitalize'>{name}</Text>
                        <CopyButtonFactory value={name} />
                    </div>

                    <div style={{ ...style }} >
                        Documento: <Text c="dimmed">{document}</Text>
                        <CopyButtonFactory value={document} />
                    </div>
                </Group>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}

export default ClientInfo