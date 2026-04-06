"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import IssueStatusTimeline from "@/components/IssueStatusTimeline";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Send,
  User,
  Upload,
  Sparkles,
  Wrench,
  IndianRupee,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { DynamicLocationPicker } from "@/components/map/DynamicLocationPicker";
import type { LocationData } from "@/components/map/LocationPicker";

export default function IssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inlineToast, setInlineToast] = useState<{ show: boolean; title: string; category: string }>({ show: false, title: "", category: "" });
  const [showPartnerSuggestion, setShowPartnerSuggestion] = useState(false);
  const [suggestedPartner, setSuggestedPartner] = useState<any>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("open");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [costLoading, setCostLoading] = useState(false);
  const [aiDepartment, setAiDepartment] = useState(""); // stores estimated cost range
  const [aiReport, setAiReport] = useState<any>(null);
  const [showAiReport, setShowAiReport] = useState(false);
  const [issueLocation, setIssueLocation] = useState<LocationData | null>(null);

  // Issue category → service category mapping
  const ISSUE_TO_SERVICE: Record<string, string> = {
    Plumbing:     "plumbing",
    Electrical:   "electrical",
    Carpentry:    "carpentry",
    Painting:     "painting",
    Cleaning:     "cleaning",
    Housekeeping: "cleaning",
    "Pest Control": "pest",
    "AC/Heating": "ac",
    Appliance:    "appliance",
    Security:     "security",
    Gardening:    "gardening",
    Maintenance:  "maintenance",
    Parking:      "maintenance",
    Amenities:    "maintenance",
  };

  // Keyword fallback when category doesn't match
  const guessServiceFromText = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes("leak") || t.includes("pipe") || t.includes("drain") || t.includes("tap") || t.includes("water")) return "plumbing";
    if (t.includes("electric") || t.includes("wiring") || t.includes("power") || t.includes("light") || t.includes("switch")) return "electrical";
    if (t.includes("paint") || t.includes("wall")) return "painting";
    if (t.includes("clean") || t.includes("garbage") || t.includes("waste") || t.includes("sweep")) return "cleaning";
    if (t.includes("pest") || t.includes("cockroach") || t.includes("rat") || t.includes("termite")) return "pest";
    if (t.includes("ac") || t.includes("air condition") || t.includes("cooling")) return "ac";
    if (t.includes("door") || t.includes("window") || t.includes("wood") || t.includes("cabinet")) return "carpentry";
    if (t.includes("cctv") || t.includes("security") || t.includes("lock")) return "security";
    if (t.includes("garden") || t.includes("plant") || t.includes("lawn")) return "gardening";
    return "maintenance"; // safe default
  };

  const resolveViaService = async (issue: any, e?: React.MouseEvent) => {
    e?.stopPropagation();

    // Mark issue as in_progress
    await supabase.from("issues").update({ status: "in_progress" }).eq("id", issue.id);
    setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: "in_progress" } : i));
    toast.success("Issue marked In Progress - redirecting to Services...");

    // Determine service category
    const serviceCategory = ISSUE_TO_SERVICE[issue.category] || guessServiceFromText(`${issue.title} ${issue.description}`);

    // Build prefill params
    const params = new URLSearchParams({
      issueCategory: serviceCategory,
      issueDescription: issue.description || issue.title,
      issueId: issue.id,
    });

    setTimeout(() => router.push(`/dashboard/services?${params.toString()}`), 800);
  };

  useEffect(() => {
    fetchIssues();
    fetchUserVotes();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data) setCurrentUser(data);
  };

  const fetchIssues = async () => {
    const { data, error } = await supabase
      .from("issues")
      .select(`
        *,
        profiles:created_by (full_name, flat_number)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setIssues(data);
    }
    setLoading(false);
  };

  const fetchUserVotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("issue_votes")
      .select("issue_id")
      .eq("user_id", user.id);

    if (data) {
      setUserVotes(new Set(data.map(v => v.issue_id)));
    }
  };

  const fetchComments = async (issueId: string) => {
    const { data } = await supabase
      .from("issue_comments")
      .select(`
        *,
        profiles:user_id (full_name, flat_number)
      `)
      .eq("issue_id", issueId)
      .order("created_at", { ascending: true });

    if (data) {
      setComments(data);
    }
  };


  // Keyword-based cost estimator - HIGH cost keywords checked first to avoid wrong cheap defaults
  const estimateCost = (text: string, category: string): string | null => {
    const t = text.toLowerCase();
    // HIGH cost (check first - highest priority)
    if (t.includes("full renovation") || t.includes("complete renovation") || t.includes("rebuild")) return "Rs. 1,00,000 - Rs. 5,00,000";
    if (t.includes("pop") || t.includes("false ceiling") || t.includes("ceiling work") || t.includes("plaster of paris")) return "Rs. 50,000 - Rs. 1,50,000";
    if (t.includes("waterproof") || t.includes("seepage") || t.includes("terrace repair")) return "Rs. 15,000 - Rs. 50,000";
    if (t.includes("lift") || t.includes("elevator")) return "Rs. 10,000 - Rs. 50,000";
    if (t.includes("cctv") || t.includes("security camera")) return "Rs. 5,000 - Rs. 20,000";
    if (t.includes("motor") || t.includes("pump")) return "Rs. 5,000 - Rs. 15,000";
    // MEDIUM cost
    if (t.includes("painting") || t.includes("paint")) return "Rs. 5,000 - Rs. 30,000";
    if (t.includes("short circuit") || t.includes("rewiring") || t.includes("full wiring")) return "Rs. 3,000 - Rs. 15,000";
    if (t.includes("burst") || t.includes("major pipe")) return "Rs. 3,000 - Rs. 10,000";
    if (t.includes("installation") || t.includes("install new")) return "Rs. 2,000 - Rs. 8,000";
    if (t.includes("pest") || t.includes("termite") || t.includes("cockroach")) return "Rs. 1,500 - Rs. 5,000";
    if (t.includes("ac") || t.includes("air condition")) return "Rs. 1,500 - Rs. 6,000";
    if (t.includes("not working") || t.includes("broken") || t.includes("damaged")) return "Rs. 1,000 - Rs. 5,000";
    if (t.includes("door") || t.includes("window") || t.includes("hinge")) return "Rs. 1,000 - Rs. 5,000";
    // LOW cost
    if (t.includes("wiring") || t.includes("electrical")) return "Rs. 500 - Rs. 10,000";
    if (t.includes("leak") || t.includes("drip") || t.includes("tap") || t.includes("plumbing")) return "Rs. 500 - Rs. 3,000";
    if (t.includes("cleaning") || t.includes("sweep") || t.includes("mop")) return "Rs. 500 - Rs. 2,000";
    if (t.includes("bulb") || t.includes("switch") || t.includes("socket")) return "Rs. 200 - Rs. 1,000";
    if (t.includes("minor") || t.includes("small fix") || t.includes("quick fix")) return "Rs. 200 - Rs. 800";
    // Category fallbacks
    const catMap: Record<string, string> = {
      Plumbing: "Rs. 500 - Rs. 5,000",
      Electrical: "Rs. 500 - Rs. 10,000",
      Maintenance: "Rs. 1,000 - Rs. 8,000",
      Security: "Rs. 2,000 - Rs. 20,000",
      Parking: "Rs. 500 - Rs. 3,000",
      Amenities: "Rs. 2,000 - Rs. 15,000",
      Housekeeping: "Rs. 500 - Rs. 2,000",
    };
    return catMap[category] || null; // null = "Estimate not available"
  };

  // "Generate with AI" - enhances description only, does NOT set cost
  const generateFromDescription = () => {
    if (!newIssue.description.trim()) return;
    setAiLoading(true);
    const note = newIssue.description.trim();
    const t = note.toLowerCase();
    let enhanced = note;
    if (t.includes("pop") || t.includes("false ceiling")) {
      enhanced = `POP/false ceiling work required. ${note} Skilled labour and quality materials needed for professional finish.`;
    } else if (t.includes("renovation")) {
      enhanced = `Renovation work required. ${note} Comprehensive work including materials and skilled labour.`;
    } else if (t.includes("leak") || t.includes("drip")) {
      enhanced = `Water leakage reported. ${note} Requires immediate inspection and repair to prevent further damage.`;
    } else if (t.includes("burst")) {
      enhanced = `Critical pipe burst. ${note} Emergency repair needed with possible pipe replacement.`;
    } else if (t.includes("paint")) {
      enhanced = `Painting work required. ${note} Includes surface preparation and quality paint application.`;
    } else if (t.includes("electrical") || t.includes("wiring")) {
      enhanced = `Electrical issue reported. ${note} Licensed electrician inspection and repair needed.`;
    } else if (t.includes("clean")) {
      enhanced = `Cleaning required. ${note} Professional cleaning and sanitization needed.`;
    } else {
      enhanced = `Issue reported: ${note} Professional assessment and repair required.`;
    }
    setNewIssue(prev => ({ ...prev, description: enhanced }));
    setTimeout(() => setAiLoading(false), 500);
  };

  // "Estimate Cost" - reads description, runs estimator, updates cost display separately
  const estimateCostIssue = () => {
    if (!newIssue.description.trim()) return;
    setCostLoading(true);
    setTimeout(() => {
      const result = estimateCost(newIssue.description, newIssue.category);
      setAiDepartment(result ?? "Estimate not available");
      setCostLoading(false);
    }, 600);
  };


  const generateAiReport = (issue: any) => {
    // Simple logic-based transformation
    const desc = issue.description.toLowerCase();
    const category = issue.category || "General";
    
    // Determine possible cause based on category and keywords
    let possibleCause = "";
    let suggestedSolution = "";
    let estimatedWork = "";

    if (category === "Plumbing") {
      if (desc.includes("leak")) {
        possibleCause = "Worn-out washer, loose connection, or damaged pipe seal";
        suggestedSolution = "Inspect and replace faulty washers, tighten connections, or apply sealant";
        estimatedWork = "30-60 minutes";
      } else if (desc.includes("burst") || desc.includes("broken")) {
        possibleCause = "High water pressure, corrosion, or physical damage to pipes";
        suggestedSolution = "Replace damaged pipe section and check water pressure regulator";
        estimatedWork = "2-4 hours";
      } else {
        possibleCause = "General plumbing wear and tear or blockage";
        suggestedSolution = "Professional inspection and repair of plumbing system";
        estimatedWork = "1-2 hours";
      }
    } else if (category === "Electrical") {
      if (desc.includes("short") || desc.includes("spark")) {
        possibleCause = "Faulty wiring, overloaded circuit, or damaged electrical component";
        suggestedSolution = "Immediate inspection by licensed electrician, replace damaged wiring";
        estimatedWork = "1-3 hours";
      } else if (desc.includes("not working") || desc.includes("power")) {
        possibleCause = "Tripped circuit breaker, loose connection, or component failure";
        suggestedSolution = "Check circuit breaker, inspect connections, replace faulty components";
        estimatedWork = "30 minutes - 2 hours";
      } else {
        possibleCause = "Electrical system malfunction or component degradation";
        suggestedSolution = "Professional electrical inspection and repair";
        estimatedWork = "1-2 hours";
      }
    } else if (category === "Maintenance") {
      possibleCause = "Regular wear and tear or lack of preventive maintenance";
      suggestedSolution = "Schedule routine maintenance and repair damaged components";
      estimatedWork = "1-3 hours";
    } else {
      possibleCause = "Issue requires detailed inspection to determine root cause";
      suggestedSolution = "Contact appropriate service provider for professional assessment";
      estimatedWork = "Varies based on complexity";
    }

    setAiReport({
      summary: `${category} issue reported: ${issue.title}`,
      cause: possibleCause,
      solution: suggestedSolution,
      work: estimatedWork,
    });
    setShowAiReport(true);
  };

  const createIssue = async () => {
    if (!newIssue.title || !newIssue.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUploading(true);
    let imageUrl = null;
    let videoUrl = null;

    // Upload image if selected
    if (selectedImage) {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('issue-images')
        .upload(fileName, selectedImage);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('issue-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    // Upload video if selected
    if (selectedVideo) {
      const fileExt = selectedVideo.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('issue-videos')
        .upload(fileName, selectedVideo);

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('issue-videos')
          .getPublicUrl(fileName);
        videoUrl = publicUrl;
      }
    }

    const { error } = await supabase.from("issues").insert({
      ...newIssue,
      created_by: user.id,
      image_url: imageUrl,
      video_url: videoUrl,
      latitude: issueLocation?.lat ?? null,
      longitude: issueLocation?.lng ?? null,
      location_description: issueLocation?.address ?? null,
      ward_id: issueLocation?.ward?.ward_id ?? null,
    });

    if (!error) {
      setShowCreateModal(false);
      setNewIssue({ title: "", description: "", category: "", priority: "medium" });
      setSelectedImage(null);
      setImagePreview("");
      setSelectedVideo(null);
      setVideoPreview("");
      setUploading(false);
      setAiDepartment("");
      setIssueLocation(null);
      fetchIssues();
      // Play chime sound
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const playNote = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
          gain.gain.setValueAtTime(0, ctx.currentTime + start);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
          osc.start(ctx.currentTime + start);
          osc.stop(ctx.currentTime + start + duration);
        };
        playNote(880, 0, 0.3);
        playNote(1108, 0.12, 0.3);
        playNote(1320, 0.24, 0.5);
      } catch (_) {}
      // Show inline notification
      setInlineToast({ show: true, title: newIssue.title, category: newIssue.category || "General" });
      setTimeout(() => setInlineToast({ show: false, title: "", category: "" }), 4000);

      // Show partner suggestion if category matches
      const categoryMap: Record<string, string> = {
        "Plumbing": "plumbing",
        "Electrical": "electrical",
        "Carpentry": "carpentry",
        "Painting": "painting",
        "Cleaning": "cleaning",
        "Pest Control": "pest",
        "AC/Heating": "ac",
        "Appliance": "appliance",
      };
      const serviceCategory = categoryMap[newIssue.category || ""];
      if (serviceCategory) {
        setSuggestedPartner({ category: serviceCategory, name: newIssue.category });
        setShowPartnerSuggestion(true);
      }
    }
  };

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, WebP or GIF images allowed");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be under 5MB");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error("Only MP4, WebM or MOV videos allowed");
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("Video must be under 50MB");
      return;
    }
    setSelectedVideo(file);
    const reader = new FileReader();
    reader.onloadend = () => setVideoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    setVideoPreview("");
  };

  const voteIssue = async (issueId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if already voted
    if (userVotes.has(issueId)) {
      // Remove vote
      await supabase
        .from("issue_votes")
        .delete()
        .eq("issue_id", issueId)
        .eq("user_id", user.id);

      // Decrement vote count
      const issue = issues.find(i => i.id === issueId);
      if (issue) {
        await supabase
          .from("issues")
          .update({ vote_count: Math.max(0, (issue.vote_count || 0) - 1) })
          .eq("id", issueId);
      }

      setUserVotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(issueId);
        return newSet;
      });
    } else {
      // Add vote
      const { error } = await supabase.from("issue_votes").insert({
        issue_id: issueId,
        user_id: user.id,
      });

      if (!error) {
        // Increment vote count
        const issue = issues.find(i => i.id === issueId);
        if (issue) {
          await supabase
            .from("issues")
            .update({ vote_count: (issue.vote_count || 0) + 1 })
            .eq("id", issueId);
        }

        setUserVotes(prev => new Set(prev).add(issueId));
      }
    }

    fetchIssues();
  };

  const openComments = async (issue: any) => {
    setSelectedIssue(issue);
    setShowCommentsModal(true);
    await fetchComments(issue.id);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !selectedIssue) return;

    const { error } = await supabase.from("issue_comments").insert({
      issue_id: selectedIssue.id,
      user_id: user.id,
      comment: newComment.trim(),
    });

    if (!error) {
      setNewComment("");
      await fetchComments(selectedIssue.id);
    }
  };

  const markAsClosed = async (issueId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await supabase.from("issues").update({ status: "closed", updated_at: new Date().toISOString() }).eq("id", issueId);
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: "closed" } : i));
    if (selectedIssue?.id === issueId) setSelectedIssue((prev: any) => ({ ...prev, status: "closed" }));
    toast.success("Issue marked as Closed");
  };

  const getReporterName = (issue: any) => {
    if (issue.display_name) return `${issue.display_name}${issue.display_flat ? ` (${issue.display_flat})` : ""}`;
    if (issue.profiles?.full_name) return `${issue.profiles.full_name}${issue.profiles.flat_number ? ` (${issue.profiles.flat_number})` : ""}`;
    return "Society Member";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "from-red-500 to-red-700";
      case "high": return "from-orange-500 to-orange-700";
      case "medium": return "from-yellow-500 to-yellow-700";
      case "low": return "from-green-500 to-green-700";
      default: return "from-gray-500 to-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="w-5 h-5" />;
      case "in_progress": return <Clock className="w-5 h-5" />;
      case "resolved": return <CheckCircle className="w-5 h-5" />;
      case "closed": return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const TAB_STATUSES = [
    { key: "open",        label: "Open",        color: "text-red-600 border-red-500" },
    { key: "in_progress", label: "In Progress",  color: "text-orange-600 border-orange-500" },
    { key: "resolved",    label: "Results",      color: "text-green-600 border-green-500" },
    { key: "closed",      label: "Closed",       color: "text-gray-600 border-gray-500" },
  ];

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || issue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 p-6">
      {/* Inline Notification */}
      <AnimatePresence>
        {inlineToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            className="fixed top-6 left-1/2 z-[100] bg-white rounded-2xl shadow-2xl border border-green-200 px-6 py-4 flex items-center gap-4 min-w-[320px]"
          >
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Issue Reported Successfully</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[220px]">{inlineToast.title} - {inlineToast.category}</p>
            </div>
            <div className="ml-auto w-1 h-10 rounded-full bg-green-400 overflow-hidden">
              <motion.div
                initial={{ height: "100%" }}
                animate={{ height: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="bg-green-200 w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <AlertCircle className="w-12 h-12 text-red-500" />
            </motion.div>
            Issues
          </h1>
          <p className="text-lg text-gray-600">Report and track community issues</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: "0 20px 60px rgba(239, 68, 68, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-red-500/50 transition-all flex items-center gap-3"
        >
          <Plus className="w-6 h-6" />
          Report Issue
        </motion.button>
      </motion.div>

      {/* Search and Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100 space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search issues..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base"
          />
        </div>
        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TAB_STATUSES.map(tab => {
            const count = issues.filter(i => i.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-5 py-2 rounded-xl font-semibold text-sm border-2 transition-all flex items-center gap-2 ${
                  filterStatus === tab.key
                    ? `${tab.color} bg-gray-50`
                    : "border-transparent text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  filterStatus === tab.key ? "bg-gray-200" : "bg-gray-100"
                }`}>{count}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Issues List */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : filteredIssues.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 text-center shadow-lg"
          >
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-600">Be the first to report an issue!</p>
          </motion.div>
        ) : (
          filteredIssues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.01 }}
              onClick={() => {
                setSelectedIssue(issue);
                setShowDetailsModal(true);
              }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-l-8 border-red-500 relative overflow-hidden group cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative z-10 flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getPriorityColor(issue.priority)} shadow-lg`}>
                      {issue.priority.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-700">
                      {getStatusIcon(issue.status)}
                      {issue.status.replace("_", " ").toUpperCase()}
                    </span>
                    {issue.category && (
                      <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                        {issue.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{issue.title}</h3>
                  <p className="text-gray-600 text-base mb-5 leading-relaxed">{issue.description}</p>
                  
                  {/* Issue Image */}
                  {issue.image_url && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-5 rounded-xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={issue.image_url}
                        alt="Issue"
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  )}
                  
                  {/* Issue Video */}
                  {issue.video_url && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-5 rounded-xl overflow-hidden shadow-lg"
                    >
                      <video
                        src={issue.video_url}
                        controls
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      Reported by: <span className="text-gray-700 font-semibold ml-1">{getReporterName(issue)}</span>
                    </span>
                    <span>•</span>
                    <span>{new Date(issue.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); voteIssue(issue.id); }}
                    className={`p-4 rounded-2xl transition-all shadow-lg ${
                      userVotes.has(issue.id)
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/50"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                    }`}
                  >
                    <ThumbsUp className="w-6 h-6" />
                  </motion.button>
                  <span className="font-extrabold text-xl text-blue-600">{issue.vote_count || 0}</span>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); openComments(issue); }}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors shadow-lg"
                  >
                    <MessageSquare className="w-6 h-6 text-gray-600" />
                  </motion.button>
                  {issue.status !== "resolved" && issue.status !== "closed" && (
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => resolveViaService(issue, e)}
                      className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-colors shadow-lg"
                      title="Resolve via Service"
                    >
                      <Wrench className="w-6 h-6 text-emerald-600" />
                    </motion.button>
                  )}
                  {issue.status === "resolved" && (currentUser?.role === "admin" || currentUser?.role === "maintenance") && (
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => markAsClosed(issue.id, e)}
                      className="p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors shadow-lg"
                      title="Mark as Closed"
                    >
                      <XCircle className="w-6 h-6 text-gray-600" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Issue Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                    Report New Issue
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                    placeholder="Brief description of the issue"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newIssue.description}
                    onChange={(e) => { setNewIssue({ ...newIssue, description: e.target.value }); setAiDepartment(""); }}
                    placeholder="Describe the issue in detail... e.g. POP ceiling work needed or tap leaking in kitchen"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  />
                  {/* Action buttons below textarea */}
                  <div className="flex gap-2 mt-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={generateFromDescription}
                      disabled={aiLoading || !newIssue.description.trim()}
                      className="flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {aiLoading ? "Generating..." : "Generate with AI"}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={estimateCostIssue}
                      disabled={costLoading || !newIssue.description.trim()}
                      className="flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      {costLoading ? "Estimating..." : "Estimate Cost"}
                    </motion.button>
                  </div>
                  {/* Cost display - only shows after clicking Estimate Cost */}
                  {(aiDepartment || costLoading) && (
                    <div className="mt-2 px-4 py-3 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl">
                      {costLoading ? (
                        <p className="text-xs text-indigo-500 animate-pulse">Estimating cost...</p>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-indigo-600 mb-0.5">Smart Estimated Cost:</p>
                          <p className={`font-bold ${aiDepartment === "Estimate not available" ? "text-gray-400 text-sm" : "text-indigo-700 text-base"}`}>
                            {aiDepartment}
                          </p>
                          {aiDepartment !== "Estimate not available" && (
                            <p className="text-xs text-indigo-400 mt-0.5">Based on description keywords</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={newIssue.category}
                      onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select Category</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Security">Security</option>
                      <option value="Parking">Parking</option>
                      <option value="Amenities">Amenities</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Noise">Noise</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <select
                      value={newIssue.priority}
                      onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Image & Video Upload - file chip style */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-colors border-2 ${selectedImage ? 'bg-red-50 border-red-300 text-red-700' : 'bg-gray-50 border-dashed border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600'}`}>
                      <Upload className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {selectedImage ? selectedImage.name : 'Add Photo'}
                      </span>
                      {selectedImage && (
                        <button type="button" onClick={(e) => { e.preventDefault(); removeImage(); }} className="ml-auto flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-colors border-2 ${selectedVideo ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-dashed border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'}`}>
                      <Upload className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {selectedVideo ? selectedVideo.name : 'Add Video'}
                      </span>
                      {selectedVideo && (
                        <button type="button" onClick={(e) => { e.preventDefault(); removeVideo(); }} className="ml-auto flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Location Picker */}
                <DynamicLocationPicker onChange={setIssueLocation} />

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createIssue}
                    disabled={uploading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Submitting..." : "Submit Issue"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(false)}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Issue Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedIssue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Issue Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getPriorityColor(selectedIssue.priority)} shadow-lg`}>
                  {selectedIssue.priority.toUpperCase()} PRIORITY
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-700">
                  {getStatusIcon(selectedIssue.status)}
                  {selectedIssue.status.replace("_", " ").toUpperCase()}
                </span>
                {selectedIssue.category && (
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                    {selectedIssue.category}
                  </span>
                )}
              </div>

              {/* Status Timeline */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Status Timeline
                </h4>
                <IssueStatusTimeline
                  currentStatus={selectedIssue.status}
                  createdAt={selectedIssue.created_at}
                  updatedAt={selectedIssue.updated_at}
                />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedIssue.title}</h3>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Description:</h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generateAiReport(selectedIssue)}
                    className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate AI Report
                  </motion.button>
                </div>
                <p className="text-gray-700 leading-relaxed">{selectedIssue.description}</p>
              </div>

              {/* AI Generated Report */}
              <AnimatePresence>
                {showAiReport && aiReport && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-purple-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        AI-Generated Professional Report
                      </h4>
                      <button
                        onClick={() => setShowAiReport(false)}
                        className="p-1 hover:bg-purple-200 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-purple-700 mb-1">Problem Summary</p>
                        <p className="text-sm text-gray-700 bg-white rounded-lg p-3">{aiReport.summary}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-700 mb-1">Possible Cause</p>
                        <p className="text-sm text-gray-700 bg-white rounded-lg p-3">{aiReport.cause}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-700 mb-1">Suggested Solution</p>
                        <p className="text-sm text-gray-700 bg-white rounded-lg p-3">{aiReport.solution}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-700 mb-1">Estimated Work Required</p>
                        <p className="text-sm text-gray-700 bg-white rounded-lg p-3">{aiReport.work}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Images */}
              {selectedIssue.image_url && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Photo:</h4>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl overflow-hidden shadow-lg cursor-pointer"
                    onClick={() => window.open(selectedIssue.image_url, '_blank')}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={selectedIssue.image_url}
                      alt="Issue"
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<div class="p-8 text-center bg-gray-100 rounded-xl"><p class="text-gray-500 text-sm">Image not accessible. <a href="${selectedIssue.image_url}" target="_blank" class="text-blue-500 underline">Click to open directly</a></p></div>`;
                      }}
                    />
                  </motion.div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Click image to view full size</p>
                </div>
              )}

              {/* Videos */}
              {selectedIssue.video_url && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Video:</h4>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl overflow-hidden shadow-lg"
                  >
                    <video
                      src={selectedIssue.video_url}
                      controls
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-blue-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Reported by:</span>
                  <span>{getReporterName(selectedIssue)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Reported on:</span>
                  <span>{new Date(selectedIssue.created_at).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <ThumbsUp className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Votes:</span>
                  <span>{selectedIssue.vote_count || 0}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    voteIssue(selectedIssue.id);
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${
                    userVotes.has(selectedIssue.id)
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  {userVotes.has(selectedIssue.id) ? "Voted" : "Vote"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetailsModal(false);
                    openComments(selectedIssue);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Comments
                </motion.button>
                {selectedIssue.status !== "resolved" && selectedIssue.status !== "closed" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      setShowDetailsModal(false);
                      resolveViaService(selectedIssue, e);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-5 h-5" />
                    Fix via Service
                  </motion.button>
                )}
                {selectedIssue.status === "resolved" && (currentUser?.role === "admin" || currentUser?.role === "maintenance") && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      markAsClosed(selectedIssue.id, e);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Mark as Closed
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {showCommentsModal && selectedIssue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
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
                  <h2 className="text-2xl font-bold text-gray-900">{selectedIssue.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    By {selectedIssue.display_name || selectedIssue.profiles?.full_name} ({selectedIssue.display_flat || selectedIssue.profiles?.flat_number})
                  </p>
                </div>
                <button
                  onClick={() => setShowCommentsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
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
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addComment}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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

      {/* Partner Suggestion Banner */}
      <AnimatePresence>
        {showPartnerSuggestion && suggestedPartner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 max-w-sm z-50"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 shadow-2xl border-2 border-white">
              <button
                onClick={() => setShowPartnerSuggestion(false)}
                className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <p className="text-white text-sm font-semibold mb-2">Need help fixing this?</p>
              <p className="text-indigo-100 text-xs mb-4">
                Book our verified {suggestedPartner.name} partner for quick resolution
              </p>
              <Link href="/dashboard/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPartnerSuggestion(false)}
                  className="w-full py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                >
                  View Service Partners
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
