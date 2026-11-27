import { ActionIcon, Tooltip } from "@mantine/core";
import { IconCurrencyReal, IconPercentage } from "@tabler/icons-react";

interface DiscountTypeToggleProps {
    value: ItemDiscountType;
    onChange: (value: ItemDiscountType) => void;
}

const DiscountTypeToggle = ({ value, onChange }: DiscountTypeToggleProps) => {
    const nextType = value === "fixed" ? "percentage" : "fixed";
    const nextLabel = nextType === "percentage" ? "percentual" : "em reais";

    return (
        <Tooltip label={`Alterar desconto para ${nextLabel}`} withArrow>
            <ActionIcon
                type="button"
                variant="light"
                color="violet"
                radius="lg"
                size="lg"
                aria-label={`Alterar tipo do desconto para ${nextLabel}`}
                onClick={() => onChange(nextType)}
            >
                {nextType === "percentage"
                    ? <IconPercentage size={18} />
                    : <IconCurrencyReal size={18} />}
            </ActionIcon>
        </Tooltip>
    );
};

export default DiscountTypeToggle;
