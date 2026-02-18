// mantine
import { Center, Divider, Group, Paper, ThemeIcon, Title, Text, CopyButton, Tooltip, ActionIcon, MantineStyleProp, Badge, Stack } from '@mantine/core';

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
    const status = basicData.status === 0 ? 'rascunho' : 'aprovado';
    const colorStatus = basicData.status === 0 ? 'gray' : 'green';

    const style: MantineStyleProp = {
        display: "flex", gap: 5, justifyContent: 'center', alignItems: 'center',
    }

    return (
        <Paper withBorder radius='md' className={classes.data}>
            <ThemeIcon size={50} radius={50} className={classes.dataIcon}>
                <IconNotes size={32} stroke={1.5} />
            </ThemeIcon>
            <Center>
                <Title order={4}>Informações atuais da cotação</Title>
            </Center>
            <Divider mt={20} />
            <Group justify="space-between" mt={20}>
                <div style={{ ...style }} >
                    Nome: <Text c="dimmed" tt='capitalize'>{name}</Text>
                    <CopyButtonFactory value={name} />
                </div>

                <div style={{ ...style }} >
                    Documento: <Text c="dimmed">{document}</Text>
                    <CopyButtonFactory value={document} />
                </div>
                <Badge color={colorStatus} >{status}</Badge>
            </Group>
            <Stack mt={20}>
                <Paper withBorder className={classes.notes} radius='lg'>
                    <Text>Notas sobre a cotação:</Text>
                    <Text c='dimmed'>
                        {basicData.notes ? basicData.notes : 'Sem notas'}
                    </Text>
                </Paper>
            </Stack>
        </Paper>
    )
}

export default DataInfo;