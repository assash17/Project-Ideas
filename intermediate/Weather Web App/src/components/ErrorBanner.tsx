import { motion } from 'framer-motion'

type Props = {
  message: string
}

export function ErrorBanner({ message }: Props) {
  return (
    <motion.div
      className="banner banner-error"
      role="alert"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      {message}
    </motion.div>
  )
}
