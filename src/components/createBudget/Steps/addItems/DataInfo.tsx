// mantine
import { Center, Group, Paper, ThemeIcon, Title, Text, CopyButton, Tooltip, ActionIcon, MantineStyleProp, Badge, Stack, HoverCard } from '@mantine/core';

// style
import classes from './AddItems.module.css';

// icon
import { IconNotes, IconCopy, IconCheck } from "@tabler/icons-react";

// redux
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

// utils
import { formatDocument } from '../../../../utils/formatDocument';

// type
import { quotationBasicDataSliceDataType } from '../../../../redux/createBudget/drafts/quotationBasicDataSlice';

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

const DataInfo = () => {
    const basicData = useSelector<RootState>((state) => state.createBudget.quotationBasicData) as quotationBasicDataSliceDataType;

    const name = basicData.client_name!;
    const document = formatDocument(basicData.client_document!);
    const status = basicData.status === 0 as unknown as string ? 'rascunho' : 'aprovado';
    const colorStatus = basicData.status === 0 as unknown as string ? 'gray' : 'green';

    const style: MantineStyleProp = {
        display: "flex", gap: 5, justifyContent: 'center', alignItems: 'center',
    }

    return (
        <HoverCard shadow='md' radius={'md'}>
            <Paper withBorder radius='md' className={classes.data}>
                <Center>
                    <HoverCard.Target>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <ThemeIcon size={30} radius={50} className={classes.dataIcon}>
                                <IconNotes size={20} stroke={1.5} />
                            </ThemeIcon>
                            <Title order={4}>Informações atuais da cotação</Title>
                            <Badge color={colorStatus} >{status}</Badge>
                        </div>
                    </HoverCard.Target>
                </Center>
            </Paper>
            <HoverCard.Dropdown>
                <Group justify="space-between">
                    <div style={{ ...style }} >
                        Nome: <Text c="dimmed" tt='capitalize'>{name}</Text>
                        <CopyButtonFactory value={name} />
                    </div>

                    <div style={{ ...style }} >
                        Documento: <Text c="dimmed">{document}</Text>
                        <CopyButtonFactory value={document} />
                    </div>
                </Group>
                <Stack mt={20}>
                    <Text>Notas sobre a cotação:</Text>
                    <Paper withBorder className={classes.notes} radius='md'>
                        <Text c='dimmed'>
                            {basicData.notes ? basicData.notes : 'Sem notas'}
                        </Text>
                    </Paper>
                </Stack>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}

export default DataInfo;