// framerMotion
import { motion } from "framer-motion"

// mantine
import { Alert } from "@mantine/core"

// styles
import classes from '../SearchClient.module.css'

const NoResults = ({ hasQuery, error }: { error: string | null, hasQuery: number }) => {
    return (
        <>
            {hasQuery > 0 && !error && (
                <motion.div className={classes.messages}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <Alert title="Sem resultados" mt="md" variant='transparent'>
                        Nenhum cliente encontrado
                    </Alert>
                </motion.div>
            )}
        </>
    )
}

export default NoResults