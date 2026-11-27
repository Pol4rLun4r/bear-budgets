export const hasHiddenItemReferenceContent = (
    itemReference: Partial<ItemReference>,
    referenceLinks: Partial<ReferenceLink>[],
    pendingLinkContent: string | undefined,
    visibleFields: ItemReferenceSimpleField[],
) => {
    const visibleFieldsSet = new Set(visibleFields);

    return (
        (Boolean(itemReference.internal_code?.trim()) && !visibleFieldsSet.has("internalCode")) ||
        (Boolean(itemReference.manufacturer_code?.trim()) && !visibleFieldsSet.has("manufacturerCode")) ||
        (Boolean(itemReference.ncm?.trim()) && !visibleFieldsSet.has("ncm")) ||
        (Boolean(itemReference.notes?.trim()) && !visibleFieldsSet.has("notes")) ||
        ((referenceLinks.some(({ content }) => Boolean(content?.trim())) ||
            Boolean(pendingLinkContent?.trim())) &&
            !visibleFieldsSet.has("links"))
    );
};
