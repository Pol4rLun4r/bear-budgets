// framerMotion
import { motion } from "framer-motion"

// mantine
import { Button, Stack } from "@mantine/core"

// styles
import classes from '../SearchClient.module.css'

import type { NewClientParcialDataType } from "../../CreateBudget"

interface NoResultProps {
    hasQuery: number;
    error: string | null;
    query: string;
    typeQuery: 'document' | 'name';
    onCreateNewClient?: (data: NewClientParcialDataType) => void;
}

const NoResults = ({ hasQuery, error, query, typeQuery, onCreateNewClient }: NoResultProps) => {
    return (
        <>
            {hasQuery > 0 && !error && (
                <motion.div className={classes.messages}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                        <Stack >
                            Nenhum cliente encontrado
                            <Button variant="gradient" radius='lg' onClick={() => onCreateNewClient?.({ type: typeQuery, value: query })}>Criar novo cliente</Button>
                        </Stack>
                </motion.div>
            )}
        </>
    )
}

export default NoResults