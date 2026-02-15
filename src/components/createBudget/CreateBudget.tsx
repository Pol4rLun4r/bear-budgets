import { useState } from 'react';

// styles
import classes from './CreateBudget.module.css'

// framer-motion
import { AnimatePresence, motion } from 'framer-motion';

// components
import Steps from './Steps/Steps';
import SearchClient from './SearchClient/SearchClient'
import { ActionIcon, Tooltip } from '@mantine/core';

// icons
import { IconArrowLeft} from '@tabler/icons-react';

const CreateBudget = () => {
    const [showSteps, setShowSteps] = useState(false);

    return (
        <div className={classes.container}>
            <div className={classes.slideWrapper}>
                <AnimatePresence mode='wait'>
                    {!showSteps ? (
                        <motion.div
                            className={classes.slideContent}
                            key='search-client'
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, ease: [1, 0, 0, 1] }}
                            exit={{
                                y: '100%',
                                opacity: 0,
                                transition: { duration: 0.3, ease: [1, 0, 0, 1] }
                            }}
                        >
                            <SearchClient onCreateNewClient={() => setShowSteps(true)} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='steps'
                            className={classes.slideContent}
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, ease: [1, 0, 0, 1] }}
                            exit={{
                                y: '100%',
                                opacity: 0,
                                transition: { duration: 0.3, ease: [1, 0, 0, 1] }
                            }}
                        >
                            <Steps />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Tooltip
                    label='Voltar ao inicio'
                    position='right'
                >
                    <ActionIcon
                        className={classes.backButton}
                        size='lg'
                        onClick={() => setShowSteps(false)}
                        radius='lg'
                        variant='default'
                        disabled={showSteps ? false : true}
                    >
                        <IconArrowLeft/>
                    </ActionIcon>
                </Tooltip>
            </div>
        </div>
    )
}

export default CreateBudget