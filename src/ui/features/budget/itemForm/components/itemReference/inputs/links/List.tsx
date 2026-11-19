import { useEffect, useRef } from "react";

// redux
import { ActionIcon, Anchor, Group, ScrollArea, Stack, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { ItemFormScope, removeLink } from "@/features/budget/itemForm/store/itemForm.slice";

interface ListProps {
    links: Partial<ReferenceLink>[];
    scope: ItemFormScope;
}

const List = ({ links, scope }: ListProps) => {
    const dispatch = useAppDispatch();
    const hasId = useAppSelector((state) => state.itemForm.form[scope].item_reference.id);
    const linksViewportRef = useRef<HTMLDivElement>(null);
    const previousLinkCount = useRef(links.length);

    useEffect(() => {
        if (links.length > previousLinkCount.current) {
            const viewport = linksViewportRef.current;
            viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
        }

        previousLinkCount.current = links.length;
    }, [links.length]);

    const handleRemove = (index: number) => {
        dispatch(removeLink({ scope, index }));
    };

    return (
        <ScrollArea.Autosize mah={88} type="auto" offsetScrollbars viewportRef={linksViewportRef}>
            <Stack gap="xs" px="xs" py={4}>
                {links.map((link, index) => (
                    <Group key={link.id ?? `new-link-${index}`} wrap="nowrap">
                        <Anchor
                            target="_blank"
                            href={link.content}
                            size="sm"
                            lineClamp={1}
                            style={{ flex: 1, wordBreak: "break-all" }}
                        >
                            {link.content}
                        </Anchor>
                        {hasId === undefined && (
                            <Tooltip label="Remover link">
                                <ActionIcon
                                    type="button"
                                    color="red"
                                    variant="light"
                                    size="lg"
                                    aria-label={`Remover link ${index + 1}`}
                                    onClick={() => handleRemove(index)}
                                >
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                ))}
            </Stack>
        </ScrollArea.Autosize>
    )
}

export default List