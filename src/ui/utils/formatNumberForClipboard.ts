const formatNumberForClipboard = (value: number): string | undefined => {
    if (!Number.isFinite(value)) return undefined;

    return value.toFixed(2).replace(".", ",");
};

export default formatNumberForClipboard;
