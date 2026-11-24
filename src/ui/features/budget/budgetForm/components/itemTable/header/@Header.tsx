// mantine
import { Group } from "@mantine/core"

// components
import Buttons from "./Buttons";
import Values from "./Values";

// redux
import { BudgetFormScope } from "../../../store/@rootReducer";

interface HeaderProps {
    scope: BudgetFormScope;
    tagEditingEnabled: boolean;
    onTagEditingChange: (enabled: boolean) => void;
}

const Header = ({ scope, tagEditingEnabled, onTagEditingChange }: HeaderProps) => {
    return (
        <Group
            justify="space-between"
            w={'100%'}
            align="flex-end"
            p="md"
        >
            <Values scope={scope} />
            <Buttons
                scope={scope}
                tagEditingEnabled={tagEditingEnabled}
                onTagEditingChange={onTagEditingChange}
            />
        </Group>
    )
}

export default Header; 