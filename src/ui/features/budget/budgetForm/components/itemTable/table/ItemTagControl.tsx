import { Checkbox } from "@mantine/core";
import type { CheckboxProps } from "@mantine/core";
import { IconCheck, IconMinus, IconX } from "@tabler/icons-react";

const tagColors: Record<ItemValueTag, string> = {
    0: "gray",
    1: "green",
    2: "yellow",
    3: "red",
};

interface ItemTagControlProps {
    value: ItemValueTag | null;
    ariaLabel: string;
    onClick: () => void;
}

const ItemTagControl = ({ value, ariaLabel, onClick }: ItemTagControlProps) => {
    const nextTag = value === null
        ? "o próximo estado de todas as tags"
        : value === 3 ? 0 : value + 1;
    const color = value === null ? "gray" : tagColors[value];
    const renderIcon: CheckboxProps["icon"] = ({ className }) => {
        const Icon = value === null || value === 2
            ? IconMinus
            : value === 3
            ? IconX
            : IconCheck;

        return <Icon className={className} size={16} stroke={3} />;
    };

    return (
        <Checkbox
            size="md"
            color={color}
            variant="light"
            checked={value === 1 || value === 3}
            indeterminate={value === 2 || value === null}
            icon={renderIcon}
            aria-label={`${ariaLabel}. Estado ${value ?? "misto"}. Clique para ${nextTag}`}
            onChange={onClick}
        />
    );
};

export default ItemTagControl;
