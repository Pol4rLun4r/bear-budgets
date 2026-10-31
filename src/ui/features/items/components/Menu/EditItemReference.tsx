import { useEffect, useRef } from "react";

// mantine
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBarcode,
  IconDeviceFloppy,
  IconFileText,
  IconHash,
  IconLink,
  IconNotes,
  IconPackage,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import {
  addReferenceLink,
  removeReferenceLink,
  setItemReference,
  updateReferenceLink,
  updateItemReferenceField,
  type EditableReferenceField,
} from "../../store/editItemReference.slice";

// redux toolkit query
import { skipToken } from "@reduxjs/toolkit/query";

// api
import {
  itemsApi,
  useGetItemDetailsByReferenceIdQuery,
  useUpdateItemReferenceMutation,
} from "../../store/items.api";

interface EditItemReferenceProps {
  itemReferenceId: ItemReference["id"] | null;
  onSaved: () => void;
}

const EditableReferenceForm = ({
  itemReference,
  onFieldChange,
  onAddLink,
  onLinkChange,
  onRemoveLink,
  onSave,
  canSave,
  isSaving,
}: {
  itemReference: ItemWithReferenceLinks;
  onFieldChange: (key: keyof EditableReferenceField, value: string) => void;
  onAddLink: () => void;
  onLinkChange: (index: number, content: string) => void;
  onRemoveLink: (index: number) => void;
  onSave: () => void;
  canSave: boolean;
  isSaving: boolean;
}) => {
  const linksViewportRef = useRef<HTMLDivElement>(null);
  const previousLinkCount = useRef(itemReference.reference_links.length);

  useEffect(() => {
    const linkCount = itemReference.reference_links.length;
    if (linkCount > previousLinkCount.current) {
      linksViewportRef.current?.scrollTo({ top: 0 });
    }

    previousLinkCount.current = linkCount;
  }, [itemReference.reference_links.length]);

  return (
    <Stack gap="lg">
      <Paper withBorder radius="lg" p="md">
        <Stack gap="md">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size="lg" radius="md" variant="light" color="violet">
              <IconFileText size={19} />
            </ThemeIcon>
            <div>
              <Text fw={600}>Dados principais</Text>
              <Text size="xs" c="dimmed">Identificação e informações do item</Text>
            </div>
          </Group>

          <TextInput
            withAsterisk
            size="md"
            radius="lg"
            label="Descrição"
            placeholder="Digite a descrição do item"
            leftSection={<IconFileText size={17} />}
            value={itemReference.description}
            onChange={(event) => onFieldChange("description", event.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
            <TextInput
              radius="lg"
              label="Código interno"
              placeholder="Opcional"
              leftSection={<IconHash size={17} />}
              value={itemReference.internal_code ?? ""}
              onChange={(event) => onFieldChange("internal_code", event.currentTarget.value)}
            />
            <TextInput
              radius="lg"
              label="NCM"
              placeholder="Opcional"
              leftSection={<IconPackage size={17} />}
              value={itemReference.ncm ?? ""}
              onChange={(event) => onFieldChange("ncm", event.currentTarget.value)}
            />
            <TextInput
              radius="lg"
              label="Código do fabricante"
              placeholder="Opcional"
              leftSection={<IconBarcode size={17} />}
              value={itemReference.manufacturer_code ?? ""}
              onChange={(event) => onFieldChange("manufacturer_code", event.currentTarget.value)}
            />
          </SimpleGrid>

          <Divider />

          <Textarea
            radius="lg"
            label="Notas"
            description="Anotações adicionais sobre este item"
            placeholder="Adicione uma observação (opcional)"
            leftSection={<IconNotes size={17} />}
            autosize
            minRows={3}
            maxRows={7}
            value={itemReference.notes ?? ""}
            onChange={(event) => onFieldChange("notes", event.currentTarget.value)}
          />
        </Stack>
      </Paper>

      <Accordion variant="separated" radius="lg">
        <Accordion.Item value="reference-links">
          <Accordion.Control
            icon={
              <ThemeIcon
                size="md"
                radius="xl"
                variant="light"
                color={itemReference.reference_links.length > 0 ? "violet" : "gray"}
              >
                <IconLink size={16} />
              </ThemeIcon>
            }
          >
            <Group gap="xs">
              <Text fw={500}>Links de referência</Text>
              <Badge
                size="sm"
                variant="light"
                color={itemReference.reference_links.length > 0 ? "violet" : "gray"}
              >
                {itemReference.reference_links.length}
              </Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              {itemReference.reference_links.length > 0 ? (
                <ScrollArea
                  h={88}
                  type="auto"
                  offsetScrollbars
                  viewportRef={linksViewportRef}
                >
                  <Stack gap="xs" pr="xs">
                    {itemReference.reference_links.map((link, index) => (
                      <Group
                        key={link.id ?? `new-link-${index}`}
                        wrap="nowrap"
                      >
                        <TextInput
                          aria-label={`Link de referência ${index + 1}`}
                          placeholder="https://exemplo.com"
                          type="url"
                          spellCheck={false}
                          radius="lg"
                          style={{ flex: 1 }}
                          value={link.content}
                          onChange={(event) => onLinkChange(index, event.currentTarget.value)}
                        />
                        <Tooltip label="Remover link">
                          <ActionIcon
                            type="button"
                            color="red"
                            variant="light"
                            size="lg"
                            aria-label={`Remover link ${index + 1}`}
                            onClick={() => onRemoveLink(index)}
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    ))}
                  </Stack>
                </ScrollArea>
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="xs">
                  Nenhum link cadastrado. Adicione um link de referência ou preço.
                </Text>
              )}
              <Button
                type="button"
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={onAddLink}
                radius="md"
              >
                Adicionar link
              </Button>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Button
        type="button"
        variant="gradient"
        radius="lg"
        size="md"
        leftSection={<IconDeviceFloppy size={18} />}
        disabled={!canSave || isSaving}
        loading={isSaving}
        onClick={onSave}
      >
        Salvar alterações
      </Button>
    </Stack>
  );
};

const EditItemReference = ({ itemReferenceId, onSaved }: EditItemReferenceProps) => {
  const dispatch = useAppDispatch();
  const editedReference = useAppSelector((state) => state.items.editItemReference);
  const [saveItemReference, { isLoading: isSaving }] = useUpdateItemReferenceMutation();
  const {
    currentData,
    error,
    isError,
    isFetching,
  } = useGetItemDetailsByReferenceIdQuery(
    itemReferenceId !== null && itemReferenceId !== undefined
      ? itemReferenceId
      : skipToken,
  );
  const fetchedReference = currentData?.item_with_reference_links;
  const itemReference = editedReference?.id === itemReferenceId
    ? editedReference
    : undefined;
  const hasChanges = Boolean(itemReference && fetchedReference && (
    ([
      "description",
      "internal_code",
      "manufacturer_code",
      "ncm",
      "notes",
    ] as const).some((field) =>
      (itemReference[field] ?? "") !== (fetchedReference[field] ?? "")
    )
    || itemReference.reference_links.length !== fetchedReference.reference_links.length
    || itemReference.reference_links.some((link, index) => {
      const originalLink = fetchedReference.reference_links[index];
      return !originalLink
        || link.id !== originalLink.id
        || link.content !== originalLink.content;
    })
  ));

  useEffect(() => {
    if (!fetchedReference || editedReference?.id === fetchedReference.id) return;

    dispatch(setItemReference(fetchedReference));
  }, [dispatch, editedReference?.id, fetchedReference]);

  useEffect(() => {
    if (!error) return;

    const message = "error" in error
      ? error.error
      : error.message ?? "Não foi possível buscar os dados da referência.";

    notifications.show({
      title: "Erro ao buscar referência do item",
      message,
      position: "bottom-right",
      color: "pink",
    });
  }, [error]);

  if (itemReferenceId === null || itemReferenceId === undefined) {
    return <Text role="alert" c="red">Não foi possível identificar a referência do item.</Text>;
  }

  if (isError) {
    const errorMessage = error && "error" in error
      ? error.error
      : "Não foi possível carregar os dados da referência.";

    return <Text role="alert" c="red">{errorMessage}</Text>;
  }

  if (isFetching || !itemReference) {
    return (
      <Stack>
        <Skeleton height={56} />
        <Skeleton height={56} />
        <Skeleton height={56} />
        <Skeleton height={56} />
        <Skeleton height={112} />
      </Stack>
    );
  }

  const handleFieldChange = (key: keyof EditableReferenceField, value: string) => {
    dispatch(updateItemReferenceField({ key, value }));
  };

  const handleLinkChange = (index: number, content: string) => {
    dispatch(updateReferenceLink({ index, content }));
  };

  const handleSave = async () => {
    if (!itemReference || itemReference.id === undefined || !hasChanges) return;
    const itemReferenceId = itemReference.id;

    try {
      const updatedReference = await saveItemReference({
        item_reference: {
          id: itemReference.id,
          description: itemReference.description,
          internal_code: itemReference.internal_code,
          manufacturer_code: itemReference.manufacturer_code,
          ncm: itemReference.ncm,
          notes: itemReference.notes,
        },
        reference_links: itemReference.reference_links.map(({ id, content }) => ({
          ...(id === undefined ? {} : { id }),
          content,
        })),
      }).unwrap();

      if (!updatedReference) {
        throw new Error("O serviço não retornou os dados atualizados da referência.");
      }

      dispatch(setItemReference(updatedReference));
      dispatch(itemsApi.util.updateQueryData(
        "getItemDetailsByReferenceId",
        itemReferenceId,
        (details) => {
          if (details) details.item_with_reference_links = updatedReference;
        },
      ));

      notifications.show({
        title: "Referência atualizada",
        message: "As alterações foram salvas com sucesso.",
        position: "bottom-right",
        color: "teal",
      });
      onSaved();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : error && typeof error === "object" && "error" in error && typeof error.error === "string"
          ? error.error
          : "Não foi possível salvar as alterações. Tente novamente.";

      notifications.show({
        title: "Erro ao salvar referência",
        message,
        position: "bottom-right",
        color: "pink",
      });
    }
  };

  return (
    <EditableReferenceForm
      itemReference={itemReference}
      onFieldChange={handleFieldChange}
      onAddLink={() => dispatch(addReferenceLink())}
      onLinkChange={handleLinkChange}
      onRemoveLink={(index) => dispatch(removeReferenceLink(index))}
      onSave={() => void handleSave()}
      canSave={hasChanges}
      isSaving={isSaving}
    />
  );
}

export default EditItemReference;