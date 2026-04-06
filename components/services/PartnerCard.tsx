"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, IndianRupee, Tag, Phone, User } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  category: string;
  desc: string;
  price: string;
  discount: string;
  rating: number;
  contact: {
    personName: string;
    phone: string;
  };
}

interface PartnerCardProps {
  partner: Partner;
  categoryColor: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  bookingAmount: number;
  onRequest: (partner: Partner) => void;
  index: number;
}

export const PartnerCard = memo(function PartnerCard({
  partner,
  categoryColor,
  categoryIcon: Icon,
  bookingAmount,
  onRequest,
  index,
}: PartnerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-indigo-200"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColor} shadow-md flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{partner.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{partner.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold text-gray-700">{partner.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-green-600">
          <Tag className="w-4 h-4" />
          <span className="text-sm font-semibold">{partner.discount}</span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">{partner.contact.personName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-600">{partner.contact.phone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Booking Amount</p>
          <p className="text-lg font-black text-gray-900 flex items-center gap-1">
            <IndianRupee className="w-4 h-4" />
            {bookingAmount}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRequest(partner)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md"
        >
          Request
        </motion.button>
      </div>
    </motion.div>
  );
});
