import { Box, Group, Select } from "@mantine/core";

import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import type { BudgetFormScope } from "../../store/@rootReducer";
import { setStatus } from "../../store/quotationInfo.slice";
import { quotationStatusOptions } from "../../../quotationStatus";

const statusOptions = Object.values(quotationStatusOptions);
const statusSelectData = statusOptions.map(({ value, label }) => ({
    value: String(value),
    label,
}));

const QuotationStatus = ({ scope }: { scope: BudgetFormScope }) => {
    const status = useAppSelector((state) => state.budgetForm.quotationInfo[scope].status ?? 0);
    const dispatch = useAppDispatch();
    const selectedStatus = statusOptions.find((option) => option.value === status);

    return (
        <Select
            label="Status"
            aria-label="Status do orçamento"
            leftSection={selectedStatus ? (
                <Box
                    aria-hidden="true"
                    w={10}
                    h={10}
                    style={{
                        backgroundColor: `var(--mantine-color-${selectedStatus.color}-4)`,
                        borderRadius: "50%",
                    }}
                />
            ) : undefined}
            data={statusSelectData}
            value={String(status)}
            onChange={(value) => {
                const selectedStatus = statusOptions.find(
                    (option) => String(option.value) === value,
                );

                if (selectedStatus) {
                    dispatch(setStatus({ scope, data: selectedStatus.value }));
                }
            }}
            renderOption={({ option }) => {
                const statusOption = statusOptions.find(
                    (item) => String(item.value) === option.value,
                );

                if (!statusOption) return option.label;

                return (
                    <Group gap="xs" wrap="nowrap">
                        <Box
                            w={10}
                            h={10}
                            style={{
                                backgroundColor: `var(--mantine-color-${statusOption.color}-4)`,
                                borderRadius: "50%",
                                flexShrink: 0,
                            }}
                        />
                        {statusOption.label}
                    </Group>
                );
            }}
            size="md"
            radius="lg"
            w={180}
        />
    );
};

export default QuotationStatus;
