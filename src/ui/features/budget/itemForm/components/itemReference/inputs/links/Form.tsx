// mantine
import { Button, Stack, TextInput } from "@mantine/core"

// icons
import { IconPlus } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { addLink, ItemFormScope } from "@/features/budget/itemForm/store/itemForm.slice";
import { resetReferenceLink, setReferenceLink } from "@/features/budget/itemForm/store/linkForm.slice";

const Form = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useAppDispatch()
    const referenceLink = useAppSelector((state) => state.itemForm.linkForm[scope]);

    const handleAddLink = () => {
        const content = referenceLink.content;
        if (content === undefined || content.length === 0) {
            dispatch(resetReferenceLink(scope));
            return;
        }

        dispatch(addLink({ scope, link: { content } }));
        dispatch(resetReferenceLink(scope));
    }

    return (
        <Stack gap="sm">
            <TextInput
                label="Link de referência/preço"
                placeholder="https://www.exemplo-de-link.com/pt-br/home"
                radius="lg"
                spellCheck={false}
                value={referenceLink.content}
                onChange={(event) =>
                    dispatch(setReferenceLink({ scope, content: event.currentTarget.value }))
                }
            />
            <Button
                type="button"
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={handleAddLink}
                radius="md"
            >
                Adicionar link
            </Button>
        </Stack>
    )
}

export default Form;