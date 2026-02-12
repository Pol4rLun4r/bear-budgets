// React
import { ReactNode } from 'react';

// frame motion
import { motion, AnimatePresence } from 'framer-motion'

// styles
import classes from '../SearchClient.module.css';

// mantine
import { Box } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

// types
import type { ClientType } from '../SearchClient';

// components
import Loading from './Loading';
import Rows from './Rows';
import NoSearch from './NoSearch';
import Error from './Error';
import NoResults from './NoResults';

export interface ContenteType {
    clients: ClientType[];
    error: string | null;
    form: UseFormReturnType<{
        query: string;
        typeQuery: string;
    }, (values: {
        query: string;
        typeQuery: string;
    }) => {
        query: string;
        typeQuery: string;
    }>
}

const Container = ({ children }: { children: ReactNode }) => {
    return (
        <motion.div
            className={classes.containerLoading}
            key="loading-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            {children}
        </motion.div>
    )
}

const Content = ({ clients, error, form }: ContenteType) => {
    const hasQuery = form.values.query.trim().length;

    return (
        <Box className={classes.box}>
            <AnimatePresence mode='wait'>
                {clients.length === 0 && (
                    <Container>
                        {/* Loader de fundo */}
                        < Loading />

                        {/* Sem resultados */}
                        < NoResults hasQuery={hasQuery} error={error} />

                        {/* Estado de erro */}
                        <Error error={error} />

                        {/* Sem buscas */}
                        <NoSearch hasQuery={hasQuery} />
                    </Container>
                )}

                {/* Com resultados */}
                {clients.length > 0 && (
                    <Rows clients={clients} />
                )}
            </AnimatePresence>
        </Box >
    )
}

export default Content;

