// mantine
import { TextInput, TextInputProps } from "@mantine/core";

// icons
import { IconSearch } from "@tabler/icons-react";

const SearchInput = (props: TextInputProps) => {
    return (
        <TextInput
            radius="xl"
            size="md"
            placeholder="Search Client by Document or Name"
            rightSectionWidth={42}
            leftSection={<IconSearch size={18} stroke={1.5} />}
            aria-label="Search client"
            {...props} />
    );
};

export default SearchInput;