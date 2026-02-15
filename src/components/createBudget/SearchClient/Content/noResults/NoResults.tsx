// framerMotion
import { motion } from "framer-motion";

// components
import CreateNewClientButton from "./CreateNewClientButton";

// styles
import classes from '../../SearchClient.module.css';

interface NoResultProps {
    hasQuery: number;
    error: string | null;
}

const NoResults = ({ hasQuery, error }: NoResultProps) => {
    return (
        <>
            {hasQuery > 0 && !error && (
                <motion.div className={classes.messages}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <CreateNewClientButton />
                </motion.div>
            )}
        </>
    )
}

export default NoResults;