/* eslint-disable @typescript-eslint/no-explicit-any */
// mantine
import { Tooltip, CopyButton, Button } from "@mantine/core"
import { useHover } from "@mantine/hooks";

// icons
import { IconCheck, IconCopy } from "@tabler/icons-react";

// style
import classes from './Row.module.css';

interface RowContentProps {
    label: any;
    disableCopyButton?: boolean;
    onlyNumbers?: boolean;
    extraText?: string;
}

const RowContent = ({ label, disableCopyButton, extraText, onlyNumbers }: RowContentProps) => {
    const { hovered, ref } = useHover();

    const rowContentProps = {
        className: classes.row,
    }

    const iconsSize = 15
    const normalizedLabel = typeof label === 'string' ? label : String(label)
    const copyValue = extraText
        ? `${extraText} ${onlyNumbers ? normalizedLabel.replace(/[^0-9,.-]/g, '') : normalizedLabel}`
        : onlyNumbers
            ? normalizedLabel.replace(/[^0-9,.-]/g, '')
            : normalizedLabel

    return (
        <Tooltip label={label} withArrow multiline maw={'40%'}>
            <span ref={ref} {...rowContentProps}>
                {disableCopyButton ? (
                    label
                ) : hovered ? (
                    <CopyButton value={copyValue}>
                        {({ copied, copy }) => (
                            <Button fullWidth size="compact-xs" color={copied ? 'teal' : 'var(--mantine-primary-color-filled)'} onClick={copy}>
                                {copied ? <IconCheck size={iconsSize} /> : <IconCopy size={iconsSize} />}
                            </Button>
                        )}
                    </CopyButton>
                ) : (label)
                }
            </span>
        </Tooltip>
    )
}

export default RowContent