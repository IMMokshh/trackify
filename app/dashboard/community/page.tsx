"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Heart,
  MessageCircle,
  Send,
  Image as ImageIcon,
  X,
  Smile,
  TrendingUp,
  Users,
  Upload,
} from "lucide-react";

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(data);
  };

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select(`
        *,
        profiles:user_id (full_name, flat_number),
        post_likes (user_id),
        post_comments (count)
      `)
      .order("created_at", { ascending: false });

    setPosts(data || []);
    setLoading(false);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUploading(true);
    let imageUrl = null;

    // Upload image if selected
    if (selectedImage) {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(fileName, selectedImage);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('community-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    await supabase.from("community_posts").insert({
      user_id: user.id,
      content: newPost,
      image_url: imageUrl,
    });

    setNewPost("");
    setSelectedImage(null);
    setImagePreview("");
    setShowNewPost(false);
    setUploading(false);
    fetchPosts();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be under 5MB.");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const openComments = async (post: any) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
    await fetchComments(post.id);
  };

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from("post_comments")
      .select(`
        *,
        profiles:user_id (full_name, flat_number)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (data) {
      setComments(data);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !selectedPost) return;

    const { error } = await supabase.from("post_comments").insert({
      post_id: selectedPost.id,
      user_id: user.id,
      comment: newComment.trim(),
    });

    if (!error) {
      setNewComment("");
      await fetchComments(selectedPost.id);
      fetchPosts(); // Refresh to update comment count
    }
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isLiked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });
    }

    fetchPosts();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-br from-purple-400 to-pink-600 p-3 rounded-2xl shadow-xl"
          >
            <Users className="w-12 h-12 text-white" />
          </motion.div>
          Community Feed
        </h1>
        <p className="text-gray-600 text-lg ml-1">Connect with your neighbors</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Posts", value: posts.length, color: "from-purple-500 to-purple-700", Icon: TrendingUp },
          { label: "Total Likes", value: posts.reduce((acc, p) => acc + (p.post_likes?.length || 0), 0), color: "from-pink-500 to-pink-700", Icon: Heart },
          { label: "Comments", value: posts.reduce((acc, p) => acc + (p.post_comments?.[0]?.count || 0), 0), color: "from-blue-500 to-blue-700", Icon: MessageCircle },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs font-semibold mb-1">{s.label}</p>
                <p className="text-4xl font-extrabold">{s.value}</p>
              </div>
              <s.Icon className="w-10 h-10 text-white/20" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Post Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowNewPost(true)}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
      >
        <div className="flex items-center justify-center gap-3">
          <Send className="w-6 h-6" />
          What's on your mind?
        </div>
      </motion.button>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post, index) => {
            const isLiked = post.post_likes?.some((like: any) => like.user_id === profile?.id);
            const likesCount = post.post_likes?.length || 0;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all"
              >
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {post.profiles?.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{post.profiles?.full_name}</h3>
                    <p className="text-sm text-gray-500">
                      {post.profiles?.flat_number} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-800 text-lg mb-6 leading-relaxed">{post.content}</p>

                {/* Post Image */}
                {post.image_url && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={post.image_url}
                      alt="Post image"
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleLike(post.id, isLiked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      isLiked
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-red-50"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    <span className="font-semibold">{likesCount}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openComments(post)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-50 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">{post.post_comments?.[0]?.count ?? 0}</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Create Post</h2>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-lg"
              />

              {/* Image Preview */}
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 relative"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Image Upload Button */}
              <div className="mt-4">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-600 rounded-xl cursor-pointer hover:bg-purple-100 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span className="font-semibold">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createPost}
                  disabled={!newPost.trim() || uploading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Posting..." : "Post"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewPost(false)}
                  className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {showCommentsModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCommentsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedPost.profiles?.full_name} • {selectedPost.profiles?.flat_number}
                  </p>
                </div>
                <button
                  onClick={() => setShowCommentsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-gray-800 text-lg">{selectedPost.content}</p>
                {selectedPost.image_url && (
                  <img
                    src={selectedPost.image_url}
                    alt="Post"
                    className="mt-4 rounded-xl w-full h-auto object-cover"
                  />
                )}
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-purple-50 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {comment.profiles?.full_name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {comment.profiles?.full_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {comment.profiles?.flat_number}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className="border-t pt-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addComment()}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addComment}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
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
