import { Blockquote, Code, List, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import ReactMarkdown, { type Components } from "react-markdown";

import classes from "../ChangeLog.module.css";

const markdownComponents: Components = {
    h2: ({ children }) => (
        <Title order={6} size="sm" fw={700} className={classes.markdownHeading}>
            {children}
        </Title>
    ),
    p: ({ children }) => (
        <Text component="p" size="sm" lh={1.65} className={classes.markdownParagraph}>
            {children}
        </Text>
    ),
    ul: ({ children }) => (
        <List size="sm" spacing="xs" withPadding className={classes.markdownList}>
            {children}
        </List>
    ),
    ol: ({ children }) => (
        <List type="ordered" size="sm" spacing="xs" withPadding className={classes.markdownList}>
            {children}
        </List>
    ),
    li: ({ children }) => <List.Item>{children}</List.Item>,
    strong: ({ children }) => <Text component="strong" fw={700} span>{children}</Text>,
    code: ({ children }) => <Code>{children}</Code>,
    blockquote: ({ children }) => (
        <Blockquote
            className={classes.markdownQuote}
            color="violet"
            icon={<IconInfoCircle size={18} />}
            iconSize={24}
            radius="md"
            p="sm"
        >
            {children}
        </Blockquote>
    ),
};

interface ChangeLogMarkdownProps {
    content: string;
}

export const ChangeLogMarkdown = ({ content }: ChangeLogMarkdownProps) => (
    <div className={classes.markdownContent}>
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
);
