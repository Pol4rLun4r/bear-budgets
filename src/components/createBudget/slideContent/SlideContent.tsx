// react
import { ReactNode } from "react";

// framer-motion
import { motion } from "framer-motion";


// style
import classes from './SlideContent.module.css';

interface SlideContentDataType {
    framerMotionKey: string;
    children: ReactNode
};

const SlideContent = ({ framerMotionKey, children }: SlideContentDataType) => {
    return (
        <motion.div
            className={classes.slideContent}
            key={framerMotionKey}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: [1, 0, 0, 1] }}
            exit={{
                y: '100%',
                opacity: 0,
                transition: { duration: 0.3, ease: [1, 0, 0, 1] }
            }}
        >
            {children}
        </motion.div>
    )
};

export default SlideContent;