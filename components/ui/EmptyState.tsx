import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { scaleIn } from "@/lib/design-system";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      {...scaleIn}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-3xl mb-6"
      >
        <Icon className="w-16 h-16 text-gray-400" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      )}
      {action}
    </motion.div>
  );
}
