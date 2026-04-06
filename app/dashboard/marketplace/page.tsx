"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, Plus, X, Search, Tag, MapPin, Phone, Upload, Heart } from "lucide-react";
import { toast } from "@/lib/toast";

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    price: "",
    category: "sell",
    contact: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data } = await supabase
      .from("marketplace")
      .select(`*, profiles:user_id (full_name, flat_number)`)
      .order("created_at", { ascending: false });
    setListings(data || []);
    setLoading(false);
  };

  const createListing = async () => {
    if (!newListing.title || !newListing.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUploading(true);
    let imageUrl = null;

    if (selectedImage) {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('marketplace-images')
        .upload(fileName, selectedImage);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('marketplace-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    await supabase.from("marketplace").insert({
      ...newListing,
      user_id: user.id,
      image_url: imageUrl,
      price: parseFloat(newListing.price) || 0,
    });

    setShowCreateModal(false);
    setNewListing({ title: "", description: "", price: "", category: "sell", contact: "" });
    setSelectedImage(null);
    setImagePreview("");
    setUploading(false);
    fetchListings();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "all" || listing.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent mb-3 flex items-center gap-4">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="bg-gradient-to-br from-orange-400 to-red-600 p-3 rounded-2xl shadow-xl">
            <ShoppingBag className="w-12 h-12 text-white" />
          </motion.div>
          Marketplace
        </h1>
        <p className="text-gray-600 text-lg ml-1">Buy, sell, and trade within your community</p>
      </motion.div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreateModal(true)} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all">
        <div className="flex items-center justify-center gap-3">
          <Plus className="w-6 h-6" />
          Post New Listing
        </div>
      </motion.button>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search listings..." className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white">
          <option value="all">All Categories</option>
          <option value="sell">For Sale</option>
          <option value="buy">Looking to Buy</option>
          <option value="lost">Lost & Found</option>
          <option value="service">Services</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl shadow-lg">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600">Be the first to post!</p>
          </div>
        ) : (
          filteredListings.map((listing, index) => (
            <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -8 }} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
              {listing.image_url && (
                <img src={listing.image_url} alt={listing.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    listing.category === 'sell' ? 'bg-green-100 text-green-700' :
                    listing.category === 'buy' ? 'bg-blue-100 text-blue-700' :
                    listing.category === 'lost' ? 'bg-red-100 text-red-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {listing.category.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                {listing.price > 0 && (
                  <p className="text-2xl font-bold text-orange-600 mb-4">Rs. {listing.price}</p>
                )}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.profiles?.flat_number}</span>
                  </div>
                  {listing.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${listing.contact}`} className="text-orange-600 hover:text-orange-700 font-semibold">
                        {listing.contact}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">New Listing</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input type="text" value={newListing.title} onChange={(e) => setNewListing({ ...newListing, title: e.target.value })} placeholder="What are you listing?" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea value={newListing.description} onChange={(e) => setNewListing({ ...newListing, description: e.target.value })} placeholder="Provide details..." rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select value={newListing.category} onChange={(e) => setNewListing({ ...newListing, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                      <option value="sell">For Sale</option>
                      <option value="buy">Looking to Buy</option>
                      <option value="lost">Lost & Found</option>
                      <option value="service">Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.)</label>
                    <input type="number" value={newListing.price} onChange={(e) => setNewListing({ ...newListing, price: e.target.value })} placeholder="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                  <input type="tel" value={newListing.contact} onChange={(e) => setNewListing({ ...newListing, contact: e.target.value })} placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>

                {imagePreview && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    <button onClick={() => { setSelectedImage(null); setImagePreview(""); }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                <div>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="font-semibold">Add Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={createListing} disabled={uploading} className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50">
                    {uploading ? "Posting..." : "Post Listing"}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreateModal(false)} className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold">
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
