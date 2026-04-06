import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { fadeInUp } from "@/lib/design-system";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, action, badge }: PageHeaderProps) {
  return (
    <motion.div
      {...fadeInUp}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
    >
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg flex-shrink-0"
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
            {badge}
          </div>
          {description && (
            <p className="text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
