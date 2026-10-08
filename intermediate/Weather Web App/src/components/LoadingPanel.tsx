import { motion } from 'framer-motion'

export function LoadingPanel() {
  return (
    <motion.div
      className="loading-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-busy="true"
      aria-label="Loading weather"
    >
      <div className="loading-skeleton loading-skeleton-lg" />
      <div className="loading-skeleton loading-skeleton-md" />
      <div className="loading-skeleton loading-skeleton-sm" />
    </motion.div>
  )
}
