"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

export function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col"
        >
            {children}
        </motion.div>
    );
}

// Stagger children animation wrapper
export function StaggerContainer({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
