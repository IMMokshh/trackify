"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { SOCIETY } from "@/lib/societyConfig";
import {
  Wrench, Zap, Hammer, Sofa, Building2, PaintBucket, Sparkles,
  Bug, Tv, Wind, Wifi, Shield, Leaf, Truck, Car as CarIcon,
  Shirt, Droplet, Palette, Hospital, Settings, Star,
  Calendar, X, CheckCircle, Clock, IndianRupee, Tag, User, Phone,
  CreditCard, AlertCircle, RefreshCw,
  Sun, Flame, Layers, PawPrint, Baby, UtensilsCrossed, Scissors,
  Dumbbell, Camera, Laptop, Package, Music, BookOpen, Bike, Waves,
  SendHorizonal, BotMessageSquare, ChevronRight as ChevronRightIcon,
} from "lucide-react";

// Service categories with icons and pricing
const SERVICE_CATEGORIES = [
  { id: "plumbing",     name: "Plumbing",            icon: Wrench,          color: "from-blue-500 to-blue-600",     range: "200-800"   },
  { id: "electrical",   name: "Electrical",           icon: Zap,             color: "from-yellow-500 to-yellow-600", range: "300-1000"  },
  { id: "carpentry",    name: "Carpentry",            icon: Hammer,          color: "from-amber-600 to-amber-700",   range: "400-1200"  },
  { id: "furniture",    name: "Furniture",            icon: Sofa,            color: "from-purple-500 to-purple-600", range: "500-2000"  },
  { id: "construction", name: "Construction",         icon: Building2,       color: "from-gray-600 to-gray-700",     range: "2000+"     },
  { id: "painting",     name: "Painting",             icon: PaintBucket,     color: "from-pink-500 to-pink-600",     range: "300-1500"  },
  { id: "cleaning",     name: "Cleaning",             icon: Sparkles,        color: "from-cyan-500 to-cyan-600",     range: "200-600"   },
  { id: "pest",         name: "Pest Control",         icon: Bug,             color: "from-red-500 to-red-600",       range: "400-1000"  },
  { id: "appliance",    name: "Appliance Repair",     icon: Tv,              color: "from-indigo-500 to-indigo-600", range: "300-1200"  },
  { id: "ac",           name: "AC Service",           icon: Wind,            color: "from-blue-400 to-blue-500",     range: "500-1500"  },
  { id: "internet",     name: "Internet/WiFi",        icon: Wifi,            color: "from-green-500 to-green-600",   range: "300-800"   },
  { id: "security",     name: "Security Systems",     icon: Shield,          color: "from-slate-600 to-slate-700",   range: "1000-3000" },
  { id: "gardening",    name: "Gardening",            icon: Leaf,            color: "from-green-600 to-green-700",   range: "250-700"   },
  { id: "movers",       name: "Movers & Packers",     icon: Truck,           color: "from-orange-500 to-orange-600", range: "1500-5000" },
  { id: "vehicle",      name: "Vehicle Repair",       icon: CarIcon,         color: "from-red-600 to-red-700",       range: "500-2000"  },
  { id: "laundry",      name: "Laundry",              icon: Shirt,           color: "from-blue-300 to-blue-400",     range: "150-500"   },
  { id: "water",        name: "Water Supply",         icon: Droplet,         color: "from-cyan-600 to-cyan-700",     range: "200-600"   },
  { id: "interior",     name: "Interior Design",      icon: Palette,         color: "from-purple-600 to-purple-700", range: "2000+"     },
  { id: "emergency",    name: "Emergency (Hospital)", icon: Hospital,        color: "from-red-700 to-red-800",       range: "1000+"     },
  { id: "maintenance",  name: "General Maintenance",  icon: Settings,        color: "from-gray-500 to-gray-600",     range: "250-900"   },
  // New categories
  { id: "solar",        name: "Solar & Energy",       icon: Sun,             color: "from-yellow-400 to-orange-500", range: "500-3000"  },
  { id: "gas",          name: "Gas & Pipeline",       icon: Flame,           color: "from-orange-600 to-red-600",    range: "300-1500"  },
  { id: "flooring",     name: "Flooring & Tiling",    icon: Layers,          color: "from-stone-500 to-stone-600",   range: "1000-5000" },
  { id: "pet",          name: "Pet Services",         icon: PawPrint,        color: "from-amber-500 to-yellow-600",  range: "200-800"   },
  { id: "childcare",    name: "Baby & Elder Care",    icon: Baby,            color: "from-pink-400 to-rose-500",     range: "300-1200"  },
  { id: "food",         name: "Food & Catering",      icon: UtensilsCrossed, color: "from-orange-400 to-amber-500",  range: "200-2000"  },
  { id: "beauty",       name: "Beauty & Wellness",    icon: Scissors,        color: "from-fuchsia-500 to-pink-600",  range: "200-1500"  },
  { id: "fitness",      name: "Fitness & Yoga",       icon: Dumbbell,        color: "from-lime-500 to-green-600",    range: "300-1000"  },
  { id: "photography",  name: "Photography",          icon: Camera,          color: "from-violet-500 to-purple-600", range: "500-5000"  },
  { id: "it",           name: "IT & Tech Support",    icon: Laptop,          color: "from-sky-500 to-blue-600",      range: "300-2000"  },
  { id: "courier",      name: "Courier & Delivery",   icon: Package,         color: "from-teal-500 to-cyan-600",     range: "50-500"    },
  { id: "music",        name: "Music & Classes",      icon: Music,           color: "from-indigo-400 to-violet-500", range: "500-2000"  },
  { id: "tutoring",     name: "Tutoring & Education", icon: BookOpen,        color: "from-blue-600 to-indigo-700",   range: "300-1500"  },
  { id: "carwash",      name: "Car Wash & Detailing", icon: Bike,            color: "from-sky-400 to-blue-500",      range: "200-1500"  },
  { id: "pool",         name: "Pool & Water Tank",    icon: Waves,           color: "from-cyan-400 to-teal-500",     range: "500-3000"  },
];

// Partner companies
const PARTNERS = [
  { id: 1, name: "QuickFix Plumbing", category: "plumbing", desc: "24/7 emergency plumbing services", price: "199", discount: "10% off", rating: 4.8 },
  { id: 2, name: "AquaPro Solutions", category: "plumbing", desc: "Expert leak detection & repair", price: "249", discount: "15% off", rating: 4.7 },
  { id: 3, name: "PowerLine Electricals", category: "electrical", desc: "Licensed electricians for all needs", price: "299", discount: "10% off", rating: 4.9 },
  { id: 4, name: "BrightSpark Services", category: "electrical", desc: "Wiring, fittings & safety checks", price: "349", discount: "12% off", rating: 4.6 },
  { id: 5, name: "WoodCraft Masters", category: "carpentry", desc: "Custom furniture & repairs", price: "399", discount: "10% off", rating: 4.8 },
  { id: 6, name: "Timber Touch", category: "carpentry", desc: "Door, window & cabinet work", price: "449", discount: "8% off", rating: 4.5 },
  { id: 7, name: "ComfortZone Furniture", category: "furniture", desc: "Sofa, bed & wardrobe assembly", price: "499", discount: "15% off", rating: 4.7 },
  { id: 8, name: "HomeStyle Furnishings", category: "furniture", desc: "Modular furniture installation", price: "599", discount: "10% off", rating: 4.6 },
  { id: 9, name: "BuildRight Contractors", category: "construction", desc: "Renovation & construction experts", price: "2000", discount: "5% off", rating: 4.9 },
  { id: 10, name: "SolidBase Builders", category: "construction", desc: "Structural work & extensions", price: "2500", discount: "7% off", rating: 4.8 },
  { id: 11, name: "ColorPalette Painters", category: "painting", desc: "Interior & exterior painting", price: "299", discount: "12% off", rating: 4.7 },
  { id: 12, name: "FreshCoat Services", category: "painting", desc: "Texture & waterproofing", price: "349", discount: "10% off", rating: 4.6 },
  { id: 13, name: "SparkleClean Pro", category: "cleaning", desc: "Deep cleaning & sanitization", price: "199", discount: "15% off", rating: 4.8 },
  { id: 14, name: "ShineOn Cleaners", category: "cleaning", desc: "Home & office cleaning", price: "249", discount: "10% off", rating: 4.5 },
  { id: 15, name: "BugBusters", category: "pest", desc: "Termite, cockroach & rodent control", price: "399", discount: "10% off", rating: 4.9 },
  { id: 16, name: "PestFree Solutions", category: "pest", desc: "Eco-friendly pest management", price: "449", discount: "12% off", rating: 4.7 },
  { id: 17, name: "FixIt Appliances", category: "appliance", desc: "Fridge, washing machine repair", price: "299", discount: "10% off", rating: 4.6 },
  { id: 18, name: "HomeAppliance Care", category: "appliance", desc: "Microwave, TV & electronics", price: "349", discount: "8% off", rating: 4.5 },
  { id: 19, name: "CoolBreeze AC Services", category: "ac", desc: "AC installation, repair & servicing", price: "499", discount: "15% off", rating: 4.8 },
  { id: 20, name: "ChillZone Cooling", category: "ac", desc: "Gas refill & maintenance", price: "599", discount: "10% off", rating: 4.7 },
  { id: 21, name: "NetSpeed Broadband", category: "internet", desc: "High-speed internet installation", price: "299", discount: "20% off", rating: 4.9 },
  { id: 22, name: "ConnectPlus WiFi", category: "internet", desc: "Router setup & troubleshooting", price: "349", discount: "15% off", rating: 4.6 },
  { id: 23, name: "SecureHome Systems", category: "security", desc: "CCTV & alarm installation", price: "999", discount: "10% off", rating: 4.8 },
  { id: 24, name: "SafeGuard Security", category: "security", desc: "Smart locks & monitoring", price: "1199", discount: "12% off", rating: 4.7 },
  { id: 25, name: "GreenThumb Gardeners", category: "gardening", desc: "Lawn care & plant maintenance", price: "249", discount: "10% off", rating: 4.6 },
  { id: 26, name: "BloomScape Services", category: "gardening", desc: "Landscaping & terrace gardens", price: "299", discount: "15% off", rating: 4.5 },
  { id: 27, name: "SwiftMove Packers", category: "movers", desc: "Local & intercity shifting", price: "1499", discount: "10% off", rating: 4.9 },
  { id: 28, name: "EasyShift Movers", category: "movers", desc: "Packing, loading & transport", price: "1799", discount: "8% off", rating: 4.7 },
  { id: 29, name: "AutoCare Garage", category: "vehicle", desc: "Car & bike servicing", price: "499", discount: "12% off", rating: 4.8 },
  { id: 30, name: "WheelFix Mechanics", category: "vehicle", desc: "Denting, painting & repairs", price: "599", discount: "10% off", rating: 4.6 },
  { id: 31, name: "FreshWash Laundry", category: "laundry", desc: "Dry cleaning & ironing", price: "149", discount: "15% off", rating: 4.7 },
  { id: 32, name: "CleanPress Services", category: "laundry", desc: "Pickup & delivery laundry", price: "199", discount: "10% off", rating: 4.5 },
  { id: 33, name: "AquaFlow Water Supply", category: "water", desc: "Tanker & pipeline services", price: "199", discount: "10% off", rating: 4.6 },
  { id: 34, name: "PureWater Solutions", category: "water", desc: "Water purifier installation", price: "249", discount: "12% off", rating: 4.7 },
  { id: 35, name: "DesignHub Interiors", category: "interior", desc: "Complete home makeover", price: "1999", discount: "10% off", rating: 4.9 },
  { id: 36, name: "ModernLiving Designs", category: "interior", desc: "3D design & execution", price: "2499", discount: "8% off", rating: 4.8 },
  { id: 37, name: "LifeCare Hospital", category: "emergency", desc: "24/7 emergency ambulance", price: "999", discount: "Society rate", rating: 4.9 },
  { id: 38, name: "MediQuick Services", category: "emergency", desc: "Home healthcare & nursing", price: "1199", discount: "15% off", rating: 4.7 },
  { id: 39, name: "HandyFix Maintenance", category: "maintenance", desc: "All-in-one home repairs", price: "249", discount: "10% off", rating: 4.8 },
  { id: 40, name: "QuickRepair Services", category: "maintenance", desc: "Minor fixes & installations", price: "299", discount: "12% off", rating: 4.6 },

  // Additional partners — plumbing
  { id: 41, name: "PipeMaster Pro", category: "plumbing", desc: "Bathroom fittings & pipeline work", price: "229", discount: "8% off", rating: 4.7 },
  { id: 42, name: "DrainClear Experts", category: "plumbing", desc: "Drain unblocking & sewer cleaning", price: "279", discount: "10% off", rating: 4.6 },
  { id: 43, name: "TapFix Services", category: "plumbing", desc: "Tap, mixer & shower repairs", price: "189", discount: "12% off", rating: 4.5 },

  // Additional partners — electrical
  { id: 44, name: "VoltCare Electricals", category: "electrical", desc: "MCB, fuse & panel repairs", price: "319", discount: "10% off", rating: 4.8 },
  { id: 45, name: "WireWise Solutions", category: "electrical", desc: "Concealed wiring & conduit work", price: "369", discount: "8% off", rating: 4.7 },
  { id: 46, name: "LightUp Electricians", category: "electrical", desc: "LED fitting & smart switches", price: "289", discount: "15% off", rating: 4.6 },

  // Additional partners — carpentry
  { id: 47, name: "CraftWood Interiors", category: "carpentry", desc: "Modular kitchen & wardrobe work", price: "479", discount: "10% off", rating: 4.8 },
  { id: 48, name: "JoineryPlus", category: "carpentry", desc: "Staircase, railing & shelf work", price: "429", discount: "8% off", rating: 4.6 },

  // Additional partners — furniture
  { id: 49, name: "FlatPack Experts", category: "furniture", desc: "IKEA & flat-pack assembly", price: "449", discount: "12% off", rating: 4.7 },
  { id: 50, name: "SofaRescue Services", category: "furniture", desc: "Sofa repair, foam & upholstery", price: "549", discount: "10% off", rating: 4.5 },

  // Additional partners — painting
  { id: 51, name: "WallArt Painters", category: "painting", desc: "Stencil, texture & wall art", price: "379", discount: "10% off", rating: 4.8 },
  { id: 52, name: "ProCoat Painting", category: "painting", desc: "Waterproof & anti-fungal coating", price: "329", discount: "12% off", rating: 4.7 },

  // Additional partners — cleaning
  { id: 53, name: "FreshHome Cleaners", category: "cleaning", desc: "Move-in/move-out deep cleaning", price: "279", discount: "12% off", rating: 4.7 },
  { id: 54, name: "SteamClean Pro", category: "cleaning", desc: "Sofa, carpet & mattress cleaning", price: "349", discount: "10% off", rating: 4.8 },
  { id: 55, name: "GlassShine Services", category: "cleaning", desc: "Window & glass facade cleaning", price: "219", discount: "8% off", rating: 4.5 },

  // Additional partners — pest
  { id: 56, name: "ZeroTermite Co.", category: "pest", desc: "Pre & post-construction termite treatment", price: "499", discount: "10% off", rating: 4.8 },
  { id: 57, name: "BedBugBusters", category: "pest", desc: "Bed bug heat treatment", price: "549", discount: "8% off", rating: 4.7 },

  // Additional partners — appliance
  { id: 58, name: "CoolFix Appliances", category: "appliance", desc: "Refrigerator & freezer repair", price: "329", discount: "10% off", rating: 4.7 },
  { id: 59, name: "WashCare Services", category: "appliance", desc: "Washing machine & dryer repair", price: "299", discount: "12% off", rating: 4.6 },
  { id: 60, name: "SmartTV Repairs", category: "appliance", desc: "LED, LCD & smart TV servicing", price: "379", discount: "8% off", rating: 4.5 },

  // Additional partners — ac
  { id: 61, name: "ArcticAir Services", category: "ac", desc: "Split & window AC installation", price: "549", discount: "12% off", rating: 4.8 },
  { id: 62, name: "FrostFree Cooling", category: "ac", desc: "Annual AMC & gas top-up", price: "649", discount: "10% off", rating: 4.7 },

  // Additional partners — internet
  { id: 63, name: "FiberLink Broadband", category: "internet", desc: "Fiber optic connection setup", price: "399", discount: "18% off", rating: 4.9 },
  { id: 64, name: "MeshNet Solutions", category: "internet", desc: "Whole-home mesh WiFi setup", price: "449", discount: "12% off", rating: 4.7 },

  // Additional partners — security
  { id: 65, name: "VaultGuard Systems", category: "security", desc: "Video doorbell & intercom setup", price: "1099", discount: "10% off", rating: 4.8 },
  { id: 66, name: "SmartLock Pro", category: "security", desc: "Biometric & digital lock installation", price: "1299", discount: "8% off", rating: 4.7 },

  // Additional partners — gardening
  { id: 67, name: "TerraceFarm Co.", category: "gardening", desc: "Terrace vegetable garden setup", price: "349", discount: "12% off", rating: 4.7 },
  { id: 68, name: "AquaGarden Services", category: "gardening", desc: "Drip irrigation & auto-watering", price: "399", discount: "10% off", rating: 4.6 },
  { id: 69, name: "TreeCare Experts", category: "gardening", desc: "Tree trimming & stump removal", price: "449", discount: "8% off", rating: 4.5 },

  // Additional partners — movers
  { id: 70, name: "SafeShift Packers", category: "movers", desc: "Fragile & antique item shifting", price: "1999", discount: "10% off", rating: 4.8 },
  { id: 71, name: "MiniMove Services", category: "movers", desc: "Single-room & small moves", price: "999", discount: "12% off", rating: 4.7 },

  // Additional partners — vehicle
  { id: 72, name: "BikeDoc Garage", category: "vehicle", desc: "Two-wheeler service & repair", price: "399", discount: "15% off", rating: 4.7 },
  { id: 73, name: "DentFix Auto", category: "vehicle", desc: "Car denting, painting & polish", price: "699", discount: "10% off", rating: 4.6 },
  { id: 74, name: "TyrePoint Services", category: "vehicle", desc: "Tyre change, balancing & alignment", price: "349", discount: "8% off", rating: 4.5 },

  // Additional partners — laundry
  { id: 75, name: "SteamPress Laundry", category: "laundry", desc: "Bulk laundry & curtain cleaning", price: "229", discount: "12% off", rating: 4.7 },
  { id: 76, name: "QuickDry Services", category: "laundry", desc: "Same-day express laundry", price: "269", discount: "10% off", rating: 4.6 },

  // Additional partners — water
  { id: 77, name: "TankClean Pro", category: "water", desc: "Overhead & underground tank cleaning", price: "299", discount: "10% off", rating: 4.7 },
  { id: 78, name: "RO Masters", category: "water", desc: "RO purifier service & filter change", price: "279", discount: "12% off", rating: 4.8 },

  // Additional partners — interior
  { id: 79, name: "SpaceStudio Designs", category: "interior", desc: "Compact flat space optimization", price: "2299", discount: "10% off", rating: 4.8 },
  { id: 80, name: "LuxeHome Interiors", category: "interior", desc: "Premium turnkey interior solutions", price: "3499", discount: "7% off", rating: 4.9 },

  // Additional partners — emergency
  { id: 81, name: "RapidCare Ambulance", category: "emergency", desc: "BLS & ALS ambulance on call", price: "799", discount: "Society rate", rating: 4.8 },
  { id: 82, name: "HomeNurse Services", category: "emergency", desc: "Post-surgery & elderly home care", price: "1099", discount: "10% off", rating: 4.7 },
  { id: 83, name: "DocOnCall", category: "emergency", desc: "Doctor home visit within 60 min", price: "699", discount: "Society rate", rating: 4.9 },

  // Additional partners — maintenance
  { id: 84, name: "FixAll Handymen", category: "maintenance", desc: "Drilling, mounting & odd jobs", price: "199", discount: "15% off", rating: 4.7 },
  { id: 85, name: "SocietyMaintain Co.", category: "maintenance", desc: "Scheduled society upkeep contracts", price: "349", discount: "10% off", rating: 4.8 },
  { id: 86, name: "RapidFix Services", category: "maintenance", desc: "Same-day minor repair visits", price: "229", discount: "12% off", rating: 4.6 },

  // Solar & Energy
  { id: 87,  name: "SunPower Solar",        category: "solar",       desc: "Solar panel installation & cleaning",       price: "499", discount: "10% off",      rating: 4.9 },
  { id: 88,  name: "GreenWatt Energy",      category: "solar",       desc: "Inverter & UPS installation/repair",        price: "399", discount: "8% off",       rating: 4.7 },
  { id: 89,  name: "EcoVolt Solutions",     category: "solar",       desc: "Generator servicing & AMC",                 price: "549", discount: "12% off",      rating: 4.6 },
  { id: 90,  name: "BrightSun Systems",     category: "solar",       desc: "Rooftop solar & net metering setup",        price: "599", discount: "10% off",      rating: 4.8 },

  // Gas & Pipeline
  { id: 91,  name: "SafeGas Services",      category: "gas",         desc: "Gas leak detection & repair",               price: "299", discount: "10% off",      rating: 4.9 },
  { id: 92,  name: "PipelineXpert",         category: "gas",         desc: "PNG pipeline installation & fitting",       price: "349", discount: "8% off",       rating: 4.7 },
  { id: 93,  name: "CylinderDoor",          category: "gas",         desc: "LPG cylinder home delivery",                price: "99",  discount: "Society rate", rating: 4.6 },
  { id: 94,  name: "GasGuard Pro",          category: "gas",         desc: "Gas regulator & hose replacement",          price: "249", discount: "12% off",      rating: 4.8 },

  // Flooring & Tiling
  { id: 95,  name: "TileKing Services",     category: "flooring",    desc: "Floor & wall tile installation",            price: "799", discount: "10% off",      rating: 4.8 },
  { id: 96,  name: "MarbleShine Pro",       category: "flooring",    desc: "Marble & granite polishing",                price: "699", discount: "12% off",      rating: 4.7 },
  { id: 97,  name: "EpoxyFloor Experts",    category: "flooring",    desc: "Epoxy & anti-skid floor coating",           price: "999", discount: "8% off",       rating: 4.6 },
  { id: 98,  name: "WoodFloor Studio",      category: "flooring",    desc: "Wooden & laminate flooring",                price: "1199","discount": "10% off",    rating: 4.9 },
  { id: 99,  name: "GroutFix Services",     category: "flooring",    desc: "Tile grout repair & re-grouting",           price: "499", discount: "15% off",      rating: 4.5 },

  // Pet Services
  { id: 100, name: "PawCare Grooming",      category: "pet",         desc: "Dog & cat grooming at home",                price: "299", discount: "10% off",      rating: 4.8 },
  { id: 101, name: "WoofWalk Services",     category: "pet",         desc: "Daily dog walking & exercise",              price: "199", discount: "15% off",      rating: 4.7 },
  { id: 102, name: "VetOnCall",             category: "pet",         desc: "Vet home visit & vaccination",              price: "499", discount: "Society rate", rating: 4.9 },
  { id: 103, name: "PetSit Pro",            category: "pet",         desc: "Pet boarding & day care",                   price: "399", discount: "10% off",      rating: 4.6 },
  { id: 104, name: "FurFresh Bath",         category: "pet",         desc: "Pet bathing, nail trim & ear clean",        price: "249", discount: "12% off",      rating: 4.7 },

  // Baby & Elder Care
  { id: 105, name: "TinySteps Nanny",       category: "childcare",   desc: "Trained babysitters & nannies",             price: "499", discount: "10% off",      rating: 4.8 },
  { id: 106, name: "ElderEase Care",        category: "childcare",   desc: "Elderly companion & daily care",            price: "599", discount: "8% off",       rating: 4.7 },
  { id: 107, name: "PhysioHome Services",   category: "childcare",   desc: "Physiotherapy at home",                     price: "699", discount: "12% off",      rating: 4.9 },
  { id: 108, name: "BabyBliss Care",        category: "childcare",   desc: "Newborn care & mother support",             price: "799", discount: "10% off",      rating: 4.8 },
  { id: 109, name: "SeniorCare Plus",       category: "childcare",   desc: "Medical escort & hospital assistance",      price: "549", discount: "Society rate", rating: 4.6 },

  // Food & Catering
  { id: 110, name: "TiffinBox Services",    category: "food",        desc: "Daily home-cooked tiffin delivery",         price: "149", discount: "10% off",      rating: 4.8 },
  { id: 111, name: "FeastCraft Catering",   category: "food",        desc: "Event & party catering",                    price: "999", discount: "8% off",       rating: 4.7 },
  { id: 112, name: "CakeBake Studio",       category: "food",        desc: "Custom cakes & desserts on order",          price: "399", discount: "15% off",      rating: 4.9 },
  { id: 113, name: "ChefAtHome",            category: "food",        desc: "Personal chef for parties & events",        price: "1499","discount": "10% off",    rating: 4.8 },
  { id: 114, name: "HealthyBite Meals",     category: "food",        desc: "Diet & nutrition meal plans",               price: "199", discount: "12% off",      rating: 4.6 },
  { id: 115, name: "BreakfastBox Co.",      category: "food",        desc: "Morning breakfast delivery service",        price: "99",  discount: "10% off",      rating: 4.5 },

  // Beauty & Wellness
  { id: 116, name: "GlowUp Salon",          category: "beauty",      desc: "Haircut, facial & beauty at home",          price: "299", discount: "15% off",      rating: 4.8 },
  { id: 117, name: "ZenTouch Massage",      category: "beauty",      desc: "Relaxation & therapeutic massage",          price: "499", discount: "10% off",      rating: 4.7 },
  { id: 118, name: "NailArt Studio",        category: "beauty",      desc: "Manicure, pedicure & nail art",             price: "249", discount: "12% off",      rating: 4.6 },
  { id: 119, name: "BridalGlow Services",   category: "beauty",      desc: "Bridal makeup & pre-wedding packages",      price: "1999","discount": "8% off",     rating: 4.9 },
  { id: 120, name: "MensCut Pro",           category: "beauty",      desc: "Men's haircut & grooming at home",          price: "199", discount: "10% off",      rating: 4.5 },

  // Fitness & Yoga
  { id: 121, name: "YogaZone Classes",      category: "fitness",     desc: "Morning yoga sessions at home/terrace",     price: "399", discount: "10% off",      rating: 4.9 },
  { id: 122, name: "FitLife Trainer",       category: "fitness",     desc: "Personal fitness trainer at home",          price: "599", discount: "8% off",       rating: 4.8 },
  { id: 123, name: "ZumbaBeats Classes",    category: "fitness",     desc: "Zumba & aerobics group sessions",           price: "299", discount: "15% off",      rating: 4.7 },
  { id: 124, name: "MeditateNow",           category: "fitness",     desc: "Guided meditation & mindfulness",           price: "249", discount: "12% off",      rating: 4.6 },
  { id: 125, name: "KidsGym Fun",           category: "fitness",     desc: "Children's fitness & activity classes",     price: "349", discount: "10% off",      rating: 4.7 },

  // Photography
  { id: 126, name: "ClickPerfect Studio",   category: "photography", desc: "Event & birthday photography",              price: "1499","discount": "10% off",    rating: 4.9 },
  { id: 127, name: "PassportSnap",          category: "photography", desc: "Passport & ID photo at home",               price: "149", discount: "Society rate", rating: 4.6 },
  { id: 128, name: "ReelMoments Video",     category: "photography", desc: "Event videography & reels",                 price: "1999","discount": "8% off",     rating: 4.8 },
  { id: 129, name: "ProductShoot Pro",      category: "photography", desc: "Product & listing photography",             price: "799", discount: "12% off",      rating: 4.7 },

  // IT & Tech Support
  { id: 130, name: "TechFix Computers",     category: "it",          desc: "Laptop & PC repair at home",                price: "349", discount: "10% off",      rating: 4.8 },
  { id: 131, name: "DataSafe Recovery",     category: "it",          desc: "Data recovery & backup solutions",          price: "499", discount: "8% off",       rating: 4.7 },
  { id: 132, name: "PrinterDoc Services",   category: "it",          desc: "Printer setup, repair & cartridge",         price: "299", discount: "12% off",      rating: 4.5 },
  { id: 133, name: "SmartHome Setup",       category: "it",          desc: "Alexa, Google Home & smart device setup",   price: "399", discount: "10% off",      rating: 4.8 },
  { id: 134, name: "GamingRig Pro",         category: "it",          desc: "Gaming PC setup, upgrades & repair",        price: "599", discount: "8% off",       rating: 4.9 },
  { id: 135, name: "NetworkNinja",          category: "it",          desc: "LAN, NAS & home network setup",             price: "449", discount: "10% off",      rating: 4.7 },
  { id: 136, name: "VirusKill Services",    category: "it",          desc: "Virus removal & system cleanup",            price: "249", discount: "15% off",      rating: 4.6 },

  // Courier & Delivery
  { id: 137, name: "SwiftCourier Local",    category: "courier",     desc: "Same-day local parcel delivery",            price: "79",  discount: "Society rate", rating: 4.7 },
  { id: 138, name: "DocDrop Services",      category: "courier",     desc: "Document & legal paper delivery",           price: "99",  discount: "10% off",      rating: 4.6 },
  { id: 139, name: "GroceryRun Express",    category: "courier",     desc: "Grocery & essentials pickup & delivery",    price: "49",  discount: "15% off",      rating: 4.5 },
  { id: 140, name: "MedDelivery Plus",      category: "courier",     desc: "Medicine & pharmacy delivery",              price: "59",  discount: "Society rate", rating: 4.8 },

  // Music & Classes
  { id: 141, name: "MelodyMakers Music",    category: "music",       desc: "Guitar, keyboard & vocal lessons",          price: "499", discount: "10% off",      rating: 4.8 },
  { id: 142, name: "BeatBox DJ Classes",    category: "music",       desc: "DJ & music production classes",             price: "699", discount: "8% off",       rating: 4.7 },
  { id: 143, name: "DanceGroove Studio",    category: "music",       desc: "Bollywood & western dance classes",         price: "399", discount: "12% off",      rating: 4.9 },
  { id: 144, name: "TablaSitar Academy",    category: "music",       desc: "Classical Indian music lessons",            price: "449", discount: "10% off",      rating: 4.6 },

  // Tutoring & Education
  { id: 145, name: "BrightMinds Tutors",    category: "tutoring",    desc: "Home tuition for grades 1-12",              price: "399", discount: "10% off",      rating: 4.8 },
  { id: 146, name: "CodeKids Classes",      category: "tutoring",    desc: "Coding & robotics for children",            price: "499", discount: "12% off",      rating: 4.9 },
  { id: 147, name: "SpokenEnglish Pro",     category: "tutoring",    desc: "Spoken English & communication skills",     price: "349", discount: "10% off",      rating: 4.7 },
  { id: 148, name: "MathWiz Academy",       category: "tutoring",    desc: "Maths & science coaching",                  price: "449", discount: "8% off",       rating: 4.6 },
  { id: 149, name: "ArtCraft Classes",      category: "tutoring",    desc: "Drawing, painting & craft for kids",        price: "299", discount: "15% off",      rating: 4.7 },

  // Car Wash & Detailing
  { id: 150, name: "ShineCar Doorstep",     category: "carwash",     desc: "Doorstep car wash & vacuum",                price: "199", discount: "10% off",      rating: 4.7 },
  { id: 151, name: "DetailKing Pro",        category: "carwash",     desc: "Full car detailing & ceramic coat",         price: "999", discount: "8% off",       rating: 4.9 },
  { id: 152, name: "BikeWash Express",      category: "carwash",     desc: "Two-wheeler wash & polish",                 price: "99",  discount: "15% off",      rating: 4.6 },
  { id: 153, name: "AutoSpa Services",      category: "carwash",     desc: "Interior deep clean & odour removal",       price: "599", discount: "10% off",      rating: 4.8 },

  // Pool & Water Tank
  { id: 154, name: "PoolCare Pro",          category: "pool",        desc: "Swimming pool cleaning & maintenance",      price: "799", discount: "10% off",      rating: 4.8 },
  { id: 155, name: "TankScrub Services",    category: "pool",        desc: "Water tank cleaning & disinfection",        price: "499", discount: "12% off",      rating: 4.7 },
  { id: 156, name: "AquaBalance Pool",      category: "pool",        desc: "Pool chemical balancing & testing",         price: "599", discount: "8% off",       rating: 4.6 },
  { id: 157, name: "SumpClean Experts",     category: "pool",        desc: "Sump & underground tank cleaning",          price: "699", discount: "10% off",      rating: 4.7 },
];

// Fixed booking/advance amounts per category
const BOOKING_AMOUNTS: Record<string, number> = {
  plumbing: 150, electrical: 199, carpentry: 249, furniture: 299,
  construction: 399, painting: 249, cleaning: 299, pest: 349,
  appliance: 199, ac: 299, internet: 149, security: 499,
  gardening: 149, movers: 499, vehicle: 249, laundry: 99,
  water: 149, interior: 499, emergency: 299, maintenance: 149,
  solar: 299, gas: 149, flooring: 349, pet: 149,
  childcare: 249, food: 99, beauty: 149, fitness: 199,
  photography: 499, it: 199, courier: 49, music: 199,
  tutoring: 199, carwash: 99, pool: 299,
};

// Real person contacts assigned per partner id
const SERVICE_PARTNER_CONTACTS: Record<number, { personName: string; phone: string }> = {
  1:  { personName: "Ramesh Kumar",    phone: "9876543210" },
  2:  { personName: "Suresh Patel",    phone: "9823456701" },
  3:  { personName: "Anil Sharma",     phone: "9812345678" },
  4:  { personName: "Vijay Singh",     phone: "9834567890" },
  5:  { personName: "Mohan Das",       phone: "9845678901" },
  6:  { personName: "Rajan Verma",     phone: "9856789012" },
  7:  { personName: "Deepak Gupta",    phone: "9867890123" },
  8:  { personName: "Sanjay Mehta",    phone: "9878901234" },
  9:  { personName: "Prakash Rao",     phone: "9889012345" },
  10: { personName: "Harish Nair",     phone: "9890123456" },
  11: { personName: "Rakesh Joshi",    phone: "9901234567" },
  12: { personName: "Dinesh Tiwari",   phone: "9912345678" },
  13: { personName: "Sunil Yadav",     phone: "9923456789" },
  14: { personName: "Manoj Pandey",    phone: "9934567890" },
  15: { personName: "Ashok Mishra",    phone: "9945678901" },
  16: { personName: "Santosh Dubey",   phone: "9956789012" },
  17: { personName: "Rajesh Pillai",   phone: "9967890123" },
  18: { personName: "Naresh Iyer",     phone: "9978901234" },
  19: { personName: "Girish Menon",    phone: "9989012345" },
  20: { personName: "Umesh Reddy",     phone: "9990123456" },
  21: { personName: "Kiran Bhat",      phone: "9901234568" },
  22: { personName: "Tarun Saxena",    phone: "9812345679" },
  23: { personName: "Pawan Chauhan",   phone: "9823456702" },
  24: { personName: "Rohit Srivastava",phone: "9834567891" },
  25: { personName: "Amit Tripathi",   phone: "9845678902" },
  26: { personName: "Nitin Shukla",    phone: "9856789013" },
  27: { personName: "Vivek Agarwal",   phone: "9867890124" },
  28: { personName: "Gaurav Bajaj",    phone: "9878901235" },
  29: { personName: "Hemant Kapoor",   phone: "9889012346" },
  30: { personName: "Ajay Malhotra",   phone: "9890123457" },
  31: { personName: "Saurabh Bansal",  phone: "9901234569" },
  32: { personName: "Pradeep Arora",   phone: "9912345679" },
  33: { personName: "Manish Goel",     phone: "9923456780" },
  34: { personName: "Vinod Mittal",    phone: "9934567891" },
  35: { personName: "Arun Khanna",     phone: "9945678902" },
  36: { personName: "Suresh Bose",     phone: "9956789013" },
  37: { personName: "Ravi Chandra",    phone: "9967890124" },
  38: { personName: "Anand Pillai",    phone: "9978901235" },
  39: { personName: "Bharat Sinha",    phone: "9989012346" },
  40: { personName: "Dinesh Rawat",    phone: "9990123457" },
  41: { personName: "Suresh Nambiar",  phone: "9876501234" },
  42: { personName: "Rajan Pillai",    phone: "9823401235" },
  43: { personName: "Mohan Shetty",    phone: "9812301236" },
  44: { personName: "Anil Kulkarni",   phone: "9834501237" },
  45: { personName: "Vijay Desai",     phone: "9845601238" },
  46: { personName: "Deepak Joshi",    phone: "9856701239" },
  47: { personName: "Sanjay Patil",    phone: "9867801240" },
  48: { personName: "Prakash Hegde",   phone: "9878901241" },
  49: { personName: "Harish Kamath",   phone: "9889001242" },
  50: { personName: "Rakesh Naik",     phone: "9890101243" },
  51: { personName: "Dinesh Sawant",   phone: "9901201244" },
  52: { personName: "Sunil Pawar",     phone: "9912301245" },
  53: { personName: "Manoj Salvi",     phone: "9923401246" },
  54: { personName: "Ashok Gawde",     phone: "9934501247" },
  55: { personName: "Santosh More",    phone: "9945601248" },
  56: { personName: "Rajesh Bhosale",  phone: "9956701249" },
  57: { personName: "Naresh Jadhav",   phone: "9967801250" },
  58: { personName: "Girish Mane",     phone: "9978901251" },
  59: { personName: "Umesh Shinde",    phone: "9989001252" },
  60: { personName: "Kiran Deshpande", phone: "9990101253" },
  61: { personName: "Tarun Wagh",      phone: "9901201254" },
  62: { personName: "Pawan Kale",      phone: "9812301255" },
  63: { personName: "Rohit Thakur",    phone: "9823401256" },
  64: { personName: "Amit Chavan",     phone: "9834501257" },
  65: { personName: "Nitin Kamble",    phone: "9845601258" },
  66: { personName: "Vivek Lokhande",  phone: "9856701259" },
  67: { personName: "Gaurav Thorat",   phone: "9867801260" },
  68: { personName: "Hemant Gaikwad",  phone: "9878901261" },
  69: { personName: "Ajay Waghmare",   phone: "9889001262" },
  70: { personName: "Saurabh Dhole",   phone: "9890101263" },
  71: { personName: "Pradeep Surve",   phone: "9901201264" },
  72: { personName: "Manish Rane",     phone: "9912301265" },
  73: { personName: "Vinod Gharat",    phone: "9923401266" },
  74: { personName: "Arun Bendre",     phone: "9934501267" },
  75: { personName: "Suresh Dalvi",    phone: "9945601268" },
  76: { personName: "Ravi Powar",      phone: "9956701269" },
  77: { personName: "Anand Tawde",     phone: "9967801270" },
  78: { personName: "Bharat Koli",     phone: "9978901271" },
  79: { personName: "Dinesh Bhoir",    phone: "9989001272" },
  80: { personName: "Suresh Agre",     phone: "9990101273" },
  81: { personName: "Ravi Tandel",     phone: "9901201274" },
  82: { personName: "Anand Pagare",    phone: "9812301275" },
  83: { personName: "Bharat Kokate",   phone: "9823401276" },
  84: { personName: "Dinesh Mhatre",   phone: "9834501277" },
  85: { personName: "Suresh Patkar",   phone: "9845601278" },
  86: { personName: "Ravi Pednekar",   phone: "9856701279" },
  87: { personName: "Suresh Surve",    phone: "9867801280" },
  88: { personName: "Anand Bhoir",     phone: "9878901281" },
  89: { personName: "Bharat Agre",     phone: "9889001282" },
  90: { personName: "Dinesh Tandel",   phone: "9890101283" },
  91: { personName: "Ravi Pagare",     phone: "9901201284" },
  92: { personName: "Anand Kokate",    phone: "9912301285" },
  93: { personName: "Bharat Mhatre",   phone: "9923401286" },
  94: { personName: "Suresh Patkar",   phone: "9934501287" },
  95: { personName: "Kiran Sawant",    phone: "9945601288" },
  96: { personName: "Tarun Pawar",     phone: "9956701289" },
  97: { personName: "Pawan Salvi",     phone: "9967801290" },
  98: { personName: "Rohit Gawde",     phone: "9978901291" },
  99: { personName: "Amit More",       phone: "9989001292" },
  100:{ personName: "Nitin Bhosale",   phone: "9990101293" },
  101:{ personName: "Vivek Jadhav",    phone: "9901201294" },
  102:{ personName: "Gaurav Mane",     phone: "9812301295" },
  103:{ personName: "Hemant Shinde",   phone: "9823401296" },
  104:{ personName: "Ajay Deshpande",  phone: "9834501297" },
  105:{ personName: "Saurabh Wagh",    phone: "9845601298" },
  106:{ personName: "Pradeep Kale",    phone: "9856701299" },
  107:{ personName: "Manish Thakur",   phone: "9867801300" },
  108:{ personName: "Vinod Chavan",    phone: "9878901301" },
  109:{ personName: "Arun Kamble",     phone: "9889001302" },
  110:{ personName: "Suresh Lokhande", phone: "9890101303" },
  111:{ personName: "Ravi Thorat",     phone: "9901201304" },
  112:{ personName: "Anand Gaikwad",   phone: "9912301305" },
  113:{ personName: "Bharat Waghmare", phone: "9923401306" },
  114:{ personName: "Dinesh Dhole",    phone: "9934501307" },
  115:{ personName: "Suresh Surve",    phone: "9945601308" },
  116:{ personName: "Priya Sharma",    phone: "9956701309" },
  117:{ personName: "Neha Kulkarni",   phone: "9967801310" },
  118:{ personName: "Pooja Desai",     phone: "9978901311" },
  119:{ personName: "Anjali Patil",    phone: "9989001312" },
  120:{ personName: "Rahul Hegde",     phone: "9990101313" },
  121:{ personName: "Sunita Kamath",   phone: "9901201314" },
  122:{ personName: "Vikram Naik",     phone: "9812301315" },
  123:{ personName: "Kavita Sawant",   phone: "9823401316" },
  124:{ personName: "Meena Pawar",     phone: "9834501317" },
  125:{ personName: "Arjun Salvi",     phone: "9845601318" },
  126:{ personName: "Rohan Gawde",     phone: "9856701319" },
  127:{ personName: "Sneha More",      phone: "9867801320" },
  128:{ personName: "Akash Bhosale",   phone: "9878901321" },
  129:{ personName: "Divya Jadhav",    phone: "9889001322" },
  130:{ personName: "Nikhil Mane",     phone: "9890101323" },
  131:{ personName: "Siddharth Shinde",phone: "9901201324" },
  132:{ personName: "Tejas Deshpande", phone: "9912301325" },
  133:{ personName: "Omkar Wagh",      phone: "9923401326" },
  134:{ personName: "Yash Kale",       phone: "9934501327" },
  135:{ personName: "Pratik Thakur",   phone: "9945601328" },
  136:{ personName: "Harsh Chavan",    phone: "9956701329" },
  137:{ personName: "Sachin Kamble",   phone: "9967801330" },
  138:{ personName: "Vishal Lokhande", phone: "9978901331" },
  139:{ personName: "Rahul Thorat",    phone: "9989001332" },
  140:{ personName: "Amit Gaikwad",    phone: "9990101333" },
  141:{ personName: "Priya Waghmare",  phone: "9901201334" },
  142:{ personName: "Neha Dhole",      phone: "9812301335" },
  143:{ personName: "Pooja Surve",     phone: "9823401336" },
  144:{ personName: "Anjali Bhoir",    phone: "9834501337" },
  145:{ personName: "Sunita Agre",     phone: "9845601338" },
  146:{ personName: "Vikram Tandel",   phone: "9856701339" },
  147:{ personName: "Kavita Pagare",   phone: "9867801340" },
  148:{ personName: "Meena Kokate",    phone: "9878901341" },
  149:{ personName: "Arjun Mhatre",    phone: "9889001342" },
  150:{ personName: "Rohan Patkar",    phone: "9890101343" },
  151:{ personName: "Sneha Sawant",    phone: "9901201344" },
  152:{ personName: "Akash Pawar",     phone: "9912301345" },
  153:{ personName: "Divya Salvi",     phone: "9923401346" },
  154:{ personName: "Nikhil Gawde",    phone: "9934501347" },
  155:{ personName: "Siddharth More",  phone: "9945601348" },
  156:{ personName: "Tejas Bhosale",   phone: "9956701349" },
  157:{ personName: "Omkar Jadhav",    phone: "9967801350" },
};

// Subtle typewriter effect for bot messages
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}</span>;
}

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [transactionId, setTransactionId] = useState<string>("");
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [flatNumber, setFlatNumber] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [requestForm, setRequestForm] = useState({
    category: "",
    description: "",
    date: "",
    time: "",
  });
  const [dynamicPriceRange, setDynamicPriceRange] = useState("");
  const [serviceAiLoading, setServiceAiLoading] = useState(false);
  const [costLoading, setCostLoading] = useState(false);

  // Smart Service Assistant state
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantResults, setAssistantResults] = useState<{ categoryId: string; reason: string; confidence: string }[]>([]);
  const [assistantSummary, setAssistantSummary] = useState("");
  const [assistantError, setAssistantError] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);

  type ChatMsg = { from: "bot" | "user"; text: string; typewriter?: boolean };
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatStep, setChatStep] = useState<"greeting" | "awaiting_input" | "loading" | "results" | "error">("greeting");
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Category-based default cost ranges shown before user types
  const CATEGORY_COST_DEFAULTS: Record<string, string> = {
    plumbing:     "Rs. 500 - Rs. 1,500",
    electrical:   "Rs. 400 - Rs. 1,200",
    carpentry:    "Rs. 800 - Rs. 2,500",
    furniture:    "Rs. 500 - Rs. 3,000",
    construction: "Rs. 5,000 - Rs. 50,000",
    painting:     "Rs. 3,000 - Rs. 15,000",
    cleaning:     "Rs. 500 - Rs. 2,000",
    pest:         "Rs. 1,500 - Rs. 5,000",
    appliance:    "Rs. 300 - Rs. 1,500",
    ac:           "Rs. 500 - Rs. 2,500",
    internet:     "Rs. 300 - Rs. 800",
    security:     "Rs. 3,000 - Rs. 15,000",
    gardening:    "Rs. 500 - Rs. 2,000",
    movers:       "Rs. 3,000 - Rs. 15,000",
    vehicle:      "Rs. 500 - Rs. 3,000",
    laundry:      "Rs. 150 - Rs. 600",
    water:        "Rs. 300 - Rs. 1,000",
    interior:     "Rs. 10,000 - Rs. 1,00,000",
    emergency:    "Rs. 500 - Rs. 5,000",
    maintenance:  "Rs. 300 - Rs. 1,500",
    solar:        "Rs. 500 - Rs. 10,000",
    gas:          "Rs. 300 - Rs. 2,000",
    flooring:     "Rs. 1,000 - Rs. 20,000",
    pet:          "Rs. 200 - Rs. 1,000",
    childcare:    "Rs. 500 - Rs. 3,000",
    food:         "Rs. 100 - Rs. 5,000",
    beauty:       "Rs. 200 - Rs. 2,000",
    fitness:      "Rs. 300 - Rs. 1,500",
    photography:  "Rs. 500 - Rs. 10,000",
    it:           "Rs. 300 - Rs. 3,000",
    courier:      "Rs. 50 - Rs. 500",
    music:        "Rs. 500 - Rs. 2,000",
    tutoring:     "Rs. 300 - Rs. 1,500",
    carwash:      "Rs. 200 - Rs. 1,500",
    pool:         "Rs. 500 - Rs. 5,000",
  };
  /**
   * Strong keyword-based cost estimator for Indian market.
   * Checks HIGH-cost keywords first so POP/renovation never falls through to cheap defaults.
   * Falls back to category default if no keyword matches.
   */
  const estimateCost = (text: string, category?: string): string | null => {
    const t = text.toLowerCase();

    // --- PURCHASE INTENT (check first — never assign repair cost to purchases) ---
    if (t.startsWith("user wants to purchase") || t.includes("want to purchase") || t.includes("wants to buy")) {
      if (t.includes("furniture") || t.includes("sofa") || t.includes("bed") || t.includes("wardrobe")) return "Rs. 5,000 - Rs. 50,000";
      if (t.includes("appliance") || t.includes("fridge") || t.includes("washing machine") || t.includes("tv")) return "Rs. 5,000 - Rs. 80,000";
      return "Rs. 200 - Rs. 2,000";
    }

    // --- HIGH COST REPAIRS ---
    if (t.includes("full renovation") || t.includes("complete renovation")) return "Rs. 1,00,000 - Rs. 5,00,000";
    if (t.includes("pop") || t.includes("false ceiling") || t.includes("ceiling work") || t.includes("plaster of paris")) return "Rs. 50,000 - Rs. 1,50,000";
    if (t.includes("waterproof") || t.includes("seepage") || t.includes("terrace repair")) return "Rs. 15,000 - Rs. 50,000";
    if (t.includes("lift") || t.includes("elevator")) return "Rs. 10,000 - Rs. 50,000";
    if (t.includes("cctv") || t.includes("security camera")) return "Rs. 5,000 - Rs. 20,000";
    if (t.includes("motor") || t.includes("pump")) return "Rs. 5,000 - Rs. 15,000";
    if (t.includes("solar panel") || t.includes("solar installation")) return "Rs. 30,000 - Rs. 1,50,000";

    // --- MEDIUM COST REPAIRS / SERVICES ---
    if (t.includes("painting") || t.includes("paint")) return "Rs. 5,000 - Rs. 30,000";
    if (t.includes("short circuit") || t.includes("rewiring") || t.includes("full wiring")) return "Rs. 3,000 - Rs. 15,000";
    if (t.includes("burst") || t.includes("major pipe")) return "Rs. 3,000 - Rs. 10,000";
    if (t.includes("installation") || t.includes("install new") || t.includes("new fitting")) return "Rs. 2,000 - Rs. 8,000";
    if (t.includes("pest") || t.includes("termite") || t.includes("cockroach") || t.includes("bed bug")) return "Rs. 1,500 - Rs. 5,000";
    if (t.includes("ac") || t.includes("air condition")) return "Rs. 500 - Rs. 3,000";
    if (t.includes("laptop") || t.includes("computer") || t.includes("pc repair")) return "Rs. 500 - Rs. 3,000";
    if (t.includes("gaming") || t.includes("gaming setup")) return "Rs. 1,000 - Rs. 5,000";

    // --- REPAIR INTENT (broken/not working) ---
    if (t.includes("not working") || t.includes("broken") || t.includes("damaged") || t.includes("stopped working")) {
      // Only apply if it's clearly a repair context, not a purchase
      if (!t.includes("want") && !t.includes("buy") && !t.includes("purchase")) {
        return "Rs. 500 - Rs. 3,000";
      }
    }

    // --- LOW COST SERVICES ---
    if (t.includes("wiring") || t.includes("electrical")) return "Rs. 500 - Rs. 5,000";
    if (t.includes("leak") || t.includes("drip") || t.includes("tap") || t.includes("plumbing")) return "Rs. 300 - Rs. 2,000";
    if (t.includes("cleaning") || t.includes("clean") || t.includes("sweep")) return "Rs. 300 - Rs. 1,500";
    if (t.includes("grooming") || t.includes("haircut") || t.includes("salon")) return "Rs. 200 - Rs. 800";
    if (t.includes("dog") || t.includes("cat") || t.includes("pet")) return "Rs. 200 - Rs. 800";
    if (t.includes("tiffin") || t.includes("food delivery") || t.includes("meal")) return "Rs. 100 - Rs. 500";
    if (t.includes("catering") || t.includes("event food") || t.includes("party food")) return "Rs. 2,000 - Rs. 20,000";
    if (t.includes("tutor") || t.includes("class") || t.includes("lesson")) return "Rs. 300 - Rs. 1,500";
    if (t.includes("yoga") || t.includes("fitness") || t.includes("trainer")) return "Rs. 300 - Rs. 1,000";
    if (t.includes("bulb") || t.includes("switch") || t.includes("socket")) return "Rs. 150 - Rs. 600";
    if (t.includes("door") || t.includes("window") || t.includes("hinge") || t.includes("lock")) return "Rs. 300 - Rs. 2,000";
    if (t.includes("minor") || t.includes("small") || t.includes("quick fix")) return "Rs. 150 - Rs. 600";
    if (t.includes("laundry") || t.includes("dry clean") || t.includes("ironing")) return "Rs. 100 - Rs. 500";
    if (t.includes("car wash") || t.includes("bike wash")) return "Rs. 100 - Rs. 500";

    return category ? (CATEGORY_COST_DEFAULTS[category] ?? null) : null;
  };

  // "Generate with AI" — calls Groq to clean and rewrite the description naturally
  const generateServiceDescription = async () => {
    if (!requestForm.description.trim()) return;
    setServiceAiLoading(true);
    try {
      const res = await fetch("/api/clean-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput: requestForm.description.trim(),
          category: requestForm.category,
        }),
      });
      const data = await res.json();
      if (data.success && data.description) {
        setRequestForm(prev => ({ ...prev, description: data.description }));
      }
    } catch {
      // silently fail — keep original input
    } finally {
      setServiceAiLoading(false);
    }
  };

  // "Estimate Cost" - reads description, runs estimator, updates cost display
  const estimateCostFromDescription = () => {
    setCostLoading(true);
    setTimeout(() => {
      const desc = requestForm.description.trim();
      const result = desc
        ? estimateCost(desc, requestForm.category)
        : (CATEGORY_COST_DEFAULTS[requestForm.category] ?? null);
      setDynamicPriceRange(result ?? "Estimate not available");
      setCostLoading(false);
    }, 400);
  };

  useEffect(() => {
    const fetchFlat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("society_members")
        .select("flat_number, full_name, phone")
        .eq("email", user.email)
        .single();
      if (data) {
        setFlatNumber(data.flat_number);
        setUserProfile({ ...data, email: user.email });
      }
    };
    fetchFlat();
  }, []);

  // Auto-open request modal when redirected from Issues page
  useEffect(() => {
    const issueCategory = searchParams.get("issueCategory");
    const issueDescription = searchParams.get("issueDescription");
    if (!issueCategory) return;

    // Find first partner matching the category
    const partner = PARTNERS.find(p => p.category === issueCategory) || PARTNERS.find(p => p.category === "maintenance")!;
    const defaultEstimate = CATEGORY_COST_DEFAULTS[issueCategory] || "";

    setSelectedCategory(issueCategory);
    setSelectedPartner(partner);
    setRequestForm({
      category: issueCategory,
      description: issueDescription || "",
      date: "",
      time: "",
    });
    setDynamicPriceRange(defaultEstimate);
    setShowRequestModal(true);
  }, [searchParams]);

  const filteredPartners = selectedCategory
    ? PARTNERS.filter((p) => p.category === selectedCategory)
    : PARTNERS;

  const handleRequestService = (partner: any) => {
    setSelectedPartner(partner);
    setRequestForm({ category: partner.category, description: "", date: "", time: "" });
    setDynamicPriceRange(CATEGORY_COST_DEFAULTS[partner.category] || "");
    setShowRequestModal(true);
  };

  const submitRequest = () => {
    if (!requestForm.description || !requestForm.date || !requestForm.time) {
      toast.error("Please fill all fields");
      return;
    }

    const bookingAmount = BOOKING_AMOUNTS[requestForm.category] || 199;
    const discountPercent = parseInt(selectedPartner.discount.match(/\d+/)?.[0] || "0");
    const discountAmount = Math.round((bookingAmount * discountPercent) / 100);
    const finalAmount = bookingAmount - discountAmount;

    const booking = {
      id: Date.now(),
      partner: selectedPartner.name,
      partnerId: selectedPartner.id,
      category: requestForm.category,
      description: requestForm.description,
      date: requestForm.date,
      time: requestForm.time,
      flat: flatNumber,
      status: "Pending Payment",
      bookingAmount,
      discountPercent,
      discountAmount,
      finalAmount,
      discount: selectedPartner.discount,
      paymentStatus: "pending",
      transactionId: "",
    };

    setPendingBooking(booking);
    setShowRequestModal(false);
    setPaymentStatus("idle");
    setShowPaymentModal(true);
    setRequestForm({ category: "", description: "", date: "", time: "" });
  };

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const payBookingAmount = async () => {
    if (!pendingBooking) return;
    setPaymentStatus("processing");

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Check your connection.");
      setPaymentStatus("failed");
      return;
    }

    const options = {
      key: "rzp_test_SRPaX3DZP9tFTf",
      amount: pendingBooking.finalAmount * 100,
      currency: "INR",
      name: SOCIETY.appName,
      description: `Booking: ${SERVICE_CATEGORIES.find(c => c.id === pendingBooking.category)?.name} - ${pendingBooking.partner}`,
      image: "https://i.imgur.com/n5tjHFD.png",
      handler: async (response: any) => {
        const txnId = response.razorpay_payment_id;
        const confirmedBooking = {
          ...pendingBooking,
          status: "Scheduled",
          paymentStatus: "paid",
          transactionId: txnId,
        };
        setBookings(prev => [...prev, confirmedBooking]);
        setTransactionId(txnId);
        setPaymentStatus("success");
        setShowPaymentModal(false);
        setShowConfirmModal(true);
        toast.success("Payment successful! Booking confirmed.");
      },
      prefill: {
        name: userProfile?.full_name || "Resident",
        email: userProfile?.email || "",
        contact: userProfile?.phone || "9999999999",
      },
      theme: { color: "#4f46e5" },
      modal: {
        ondismiss: () => {
          if (paymentStatus !== "success") setPaymentStatus("idle");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", (response: any) => {
      toast.error("Payment failed: " + (response.error?.description || "Unknown error"));
      setPaymentStatus("failed");
    });
    rzp.open();
  };

  // Auto-scroll chat body on new messages
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages, chatStep]);

  // Push a bot message with a small delay for natural feel
  const pushBot = (text: string, delay = 0, typewriter = false) => {
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { from: "bot", text, typewriter }]);
    }, delay);
  };

  // Open assistant — reset and greet
  const openAssistant = () => {
    setAssistantOpen(true);
    setAssistantQuery("");
    setAssistantResults([]);
    setAssistantSummary("");
    setAssistantError("");
    setChatStep("greeting");
    setChatMessages([{ from: "bot", text: "Hi 👋 I can help you find the right service instantly.", typewriter: true }]);
  };

  const closeAssistant = () => {
    setAssistantOpen(false);
    setAssistantQuery("");
    setAssistantResults([]);
    setChatMessages([]);
    setChatStep("greeting");
  };

  const handleGreetingOption = (option: string) => {
    setChatMessages((prev) => [...prev, { from: "user", text: option }]);
    if (option === "Show me categories") {
      pushBot("Sure! Use the category filter below to browse all 35 service types. 👇", 400);
      setTimeout(() => setChatStep("greeting"), 600);
      setTimeout(() => setAssistantOpen(false), 1800);
      return;
    }
    pushBot("Got it. Tell me what you need help with.", 400);
    setTimeout(() => setChatStep("awaiting_input"), 500);
  };

  const runSmartAssistant = async () => {
    const q = assistantQuery.trim();
    if (!q) return;

    setChatMessages((prev) => [...prev, { from: "user", text: q }]);
    setAssistantQuery("");
    setChatStep("loading");
    pushBot("Analyzing your request...", 300, false);

    setAssistantLoading(true);
    setAssistantResults([]);
    setAssistantSummary("");
    setAssistantError("");

    try {
      const res = await fetch("/api/smart-service-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          categories: SERVICE_CATEGORIES.map((c) => ({ id: c.id, name: c.name })),
        }),
      });
      const data = await res.json();
      if (data.success && data.matches?.length) {
        setAssistantResults(data.matches);
        setAssistantSummary(data.summary || "");
        // Store intent-aware description and cost for pre-filling booking form
        if (data.description) setAssistantQuery(data.description);
        if (data.estimatedCost) setDynamicPriceRange(data.estimatedCost);
        pushBot("Here are the best matches for you:", 600, true);
        setTimeout(() => setChatStep("results"), 700);
      } else {
        pushBot("Couldn't find an exact match — try describing your issue a bit differently.", 600, true);
        setChatStep("error");
      }
    } catch {
      pushBot("Something went wrong. Please try again.", 600, true);
      setChatStep("error");
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Wrench className="w-6 h-6 text-white" />
          </motion.div>
          Services & Partners
        </h1>
        <p className="text-gray-500 mt-1">Verified service providers for your home needs</p>
      </motion.div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-600">Filter by Category</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !selectedCategory
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Services
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Your Bookings */}
      {bookings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Your Bookings ({bookings.length})
          </h2>
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{b.partner}</p>
                  <p className="text-xs text-gray-500">{b.date} at {b.time}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Partner Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map((partner, i) => {
          const cat = SERVICE_CATEGORIES.find((c) => c.id === partner.category);
          const Icon = cat?.icon || Settings;
          return (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(99,102,241,0.15)" }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${cat?.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-gray-700">{partner.rating}</span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-1">{partner.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{partner.desc}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700">
                  Society Partner
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-green-100 text-green-700">
                  {partner.discount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Booking Amount</p>
                  <p className="text-lg font-black text-gray-900">
                    Rs. {BOOKING_AMOUNTS[partner.category] || 199}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRequestService(partner)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
                >
                  Request
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Request Service Modal */}
      <AnimatePresence>
        {showRequestModal && selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-8 flex flex-col"            >
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 relative flex-shrink-0">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <h2 className="text-xl font-black text-white">Request Service</h2>
                <p className="text-indigo-200 text-sm mt-1">{selectedPartner.name}</p>
              </div>

              {searchParams.get("issueCategory") && (
                <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-xs font-semibold text-emerald-700">
                    Resolving issue via service - description prefilled from your report
                  </p>
                </div>
              )}

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Service Category
                  </label>
                  <input
                    type="text"
                    value={SERVICE_CATEGORIES.find((c) => c.id === requestForm.category)?.name || ""}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Flat Number
                  </label>
                  <input
                    type="text"
                    value={flatNumber}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Issue Description - single clean input */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Issue Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={requestForm.description}
                    onChange={(e) => { setRequestForm({ ...requestForm, description: e.target.value }); setDynamicPriceRange(""); }}
                    placeholder='Describe the issue... e.g. "POP ceiling work needed" or "tap leaking in kitchen"'
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm"
                  />
                  {/* Action buttons below textarea */}
                  <div className="flex gap-2 mt-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={generateServiceDescription}
                      disabled={serviceAiLoading || !requestForm.description.trim()}
                      className="flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {serviceAiLoading ? "Generating..." : "Generate with AI"}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={estimateCostFromDescription}
                      disabled={costLoading}
                      className="flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      {costLoading ? "Estimating..." : "Estimate Cost"}
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={requestForm.date}
                      onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Preferred Time *
                    </label>
                    <input
                      type="time"
                      value={requestForm.time}
                      onChange={(e) => setRequestForm({ ...requestForm, time: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-300 rounded-2xl p-5 shadow-inner">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Smart Estimated Cost
                    </p>
                    {dynamicPriceRange && dynamicPriceRange !== "Estimate not available" && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Calculated
                      </span>
                    )}
                  </div>
                  {costLoading ? (
                    <p className="text-sm text-indigo-500 animate-pulse">Estimating cost...</p>
                  ) : dynamicPriceRange ? (
                    <>
                      <p className={`text-2xl font-black mb-1 ${dynamicPriceRange === "Estimate not available" ? "text-gray-400 text-base" : "text-indigo-700"}`}>
                        {dynamicPriceRange === "Estimate not available" ? "Estimate not available" : dynamicPriceRange}
                      </p>
                      {dynamicPriceRange !== "Estimate not available" && (
                        <p className="text-xs text-indigo-500">Based on your description keywords</p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Click "Estimate Cost" after describing the issue</p>
                  )}
                  <p className="text-xs text-indigo-600 mt-2">
                    Society discount: {selectedPartner.discount}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={submitRequest}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg"
                  >
                    Submit Request
                  </motion.button>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && pendingBooking && selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => { if (paymentStatus !== "processing") setShowPaymentModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 relative">
                {paymentStatus !== "processing" && (
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Checkout</h2>
                    <p className="text-indigo-200 text-sm">Pay booking amount to confirm</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Service summary */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service</span>
                    <span className="font-bold text-gray-900">
                      {SERVICE_CATEGORIES.find(c => c.id === pendingBooking.category)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Provider</span>
                    <span className="font-bold text-gray-900">{selectedPartner.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-bold text-gray-900">{pendingBooking.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time</span>
                    <span className="font-bold text-gray-900">{pendingBooking.time}</span>
                  </div>
                </div>

                {/* Assigned partner */}
                {(() => {
                  const contact = SERVICE_PARTNER_CONTACTS[selectedPartner.id];
                  return contact ? (
                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{contact.personName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {contact.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold text-gray-700">{selectedPartner.rating}</span>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Amount breakdown */}
                <div className="border-2 border-indigo-100 rounded-2xl p-4 space-y-2 bg-indigo-50">
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">Payment Breakdown</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booking Amount</span>
                    <span className="font-semibold text-gray-900">Rs. {pendingBooking.bookingAmount}</span>
                  </div>
                  {pendingBooking.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({pendingBooking.discount})</span>
                      <span className="font-semibold text-green-600">- Rs. {pendingBooking.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base pt-2 border-t border-indigo-200">
                    <span className="font-bold text-gray-900">Total Payable</span>
                    <span className="font-black text-indigo-700 text-lg">Rs. {pendingBooking.finalAmount}</span>
                  </div>
                  <p className="text-xs text-gray-400">Final service cost determined after inspection</p>
                </div>

                {/* Failed state */}
                {paymentStatus === "failed" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Payment not completed</p>
                      <p className="text-xs text-red-500">You can retry or cancel the booking.</p>
                    </div>
                  </motion.div>
                )}

                {/* CTA buttons */}
                <div className="flex gap-3 pt-1">
                  <motion.button
                    whileHover={{ scale: paymentStatus === "processing" ? 1 : 1.02 }}
                    whileTap={{ scale: paymentStatus === "processing" ? 1 : 0.97 }}
                    onClick={payBookingAmount}
                    disabled={paymentStatus === "processing"}
                    className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {paymentStatus === "processing" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Processing...
                      </>
                    ) : paymentStatus === "failed" ? (
                      <><RefreshCw className="w-4 h-4" /> Retry Payment</>
                    ) : (
                      <><CreditCard className="w-4 h-4" /> Pay Rs. {pendingBooking.finalAmount}</>
                    )}
                  </motion.button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={paymentStatus === "processing"}
                    className="px-5 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Secured by Razorpay - UPI, Cards, Net Banking supported
                </p>

                {/* Test card hint */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 space-y-0.5">
                  <p className="font-bold">Test Card (Demo Mode)</p>
                  <p>Card: 5267 3181 8797 5449</p>
                  <p>Expiry: 12/26 - CVV: 123 - OTP: 1234</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedPartner && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-8"
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 relative text-center">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-black text-white">Booking Confirmed!</h2>
                <p className="text-green-100 text-sm mt-1">Service appointment scheduled</p>
              </div>

              <div className="p-6 space-y-4">
                {(() => {
                  const lastBooking = bookings[bookings.length - 1];
                  const contact = SERVICE_PARTNER_CONTACTS[selectedPartner.id];                  return (
                    <>
                      {/* Booking Amount Summary */}
                      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-2">
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">Booking Amount (Advance)</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Service</span>
                          <span className="font-bold text-gray-900">
                            {SERVICE_CATEGORIES.find((c) => c.id === lastBooking.category)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Booking Amount</span>
                          <span className="font-semibold text-gray-900">Rs. {lastBooking.bookingAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Discount ({lastBooking.discount})</span>
                          <span className="font-semibold text-green-600">- Rs. {lastBooking.discountAmount}</span>
                        </div>
                        <div className="flex justify-between text-base pt-2 border-t border-indigo-200">
                          <span className="font-bold text-gray-900">Amount Payable Now</span>
                          <span className="font-black text-indigo-700">Rs. {lastBooking.finalAmount}</span>
                        </div>
                        <p className="text-xs text-gray-400 pt-1">Final cost determined after inspection</p>
                      </div>

                      {/* Appointment Details */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date</span>
                          <span className="font-bold text-gray-900">{lastBooking.date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time</span>
                          <span className="font-bold text-gray-900">{lastBooking.time}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Flat</span>
                          <span className="font-bold text-gray-900">{lastBooking.flat}</span>
                        </div>
                      </div>

                      {/* Assigned Partner */}
                      {contact && (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                          <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">Assigned Service Partner</p>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{contact.personName}</p>
                              <p className="text-xs text-gray-500">{selectedPartner.name}</p>
                            </div>
                            <div className="ml-auto flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-xs font-bold text-gray-700">{selectedPartner.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-blue-500" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                      )}

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Partner will contact you 1 hour before the appointment.
                        </p>
                      </div>

                      {transactionId && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                          <p className="text-xs text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Payment confirmed - Txn ID: {transactionId}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-1">
                        {contact && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              setShowConfirmModal(false);
                              const lastB = bookings[bookings.length - 1];
                              const params = new URLSearchParams({
                                name: contact.personName,
                                phone: contact.phone,
                                date: lastB.date,
                                time: lastB.time,
                                purpose: "Service",
                              });
                              router.push(`/dashboard/visitors?${params.toString()}`);
                            }}
                            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm shadow-lg"
                          >
                            Generate Pass
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowConfirmModal(false)}
                          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                          Done
                        </motion.button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Smart Assistant ── */}

      {/* Backdrop blur overlay when open */}
      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{ backdropFilter: "blur(2px)", background: "rgba(15,10,40,0.08)" }}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Chat popup */}
        <AnimatePresence>
          {assistantOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              className="w-[340px] rounded-2xl overflow-hidden flex flex-col"
              style={{
                backdropFilter: "blur(20px)",
                background: "rgba(255,255,255,0.99)",
                boxShadow: "0 24px 60px rgba(99,102,241,0.18), 0 4px 16px rgba(0,0,0,0.08)",
                maxHeight: "520px",
                border: "1px solid rgba(165,143,255,0.25)",
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                      <BotMessageSquare className="w-4 h-4 text-white" />
                    </div>
                    {chatStep === "loading"
                      ? <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-violet-600 animate-pulse" />
                      : <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-violet-600" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">Smart Assistant</p>
                    <p className="text-[10px] text-indigo-200 mt-0.5">
                      {chatStep === "loading" ? "Thinking..." : "Online · Always here to help"}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeAssistant}
                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </motion.button>
              </div>

              {/* Chat body */}
              <div
                ref={chatBodyRef}
                className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0"
                style={{ maxHeight: "340px" }}
              >
                <AnimatePresence initial={false}>
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.from === "bot" && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-1.5 flex-shrink-0 mt-0.5 shadow-sm">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <motion.div
                        initial={msg.from === "user" ? { scale: 0.85 } : {}}
                        animate={msg.from === "user" ? { scale: 1 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                          msg.from === "bot"
                            ? "bg-indigo-50 text-gray-800 rounded-tl-sm shadow-sm"
                            : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-sm shadow-md"
                        }`}
                      >
                        {msg.from === "bot" && msg.typewriter
                          ? <TypewriterText text={msg.text} />
                          : msg.text
                        }
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {chatStep === "loading" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-1.5 flex-shrink-0 shadow-sm">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-indigo-50 rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1 shadow-sm">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400 block"
                          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.18, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Greeting options */}
                {chatStep === "greeting" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-col gap-1.5 pl-8"
                  >
                    {[
                      { label: "Find a service", emoji: "🔍" },
                      { label: "I have an issue", emoji: "🔧" },
                      { label: "Show me categories", emoji: "📋" },
                    ].map(({ label, emoji }) => (
                      <motion.button
                        key={label}
                        whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(99,102,241,0.15)" }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleGreetingOption(label)}
                        className="text-left px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all shadow-sm flex items-center gap-2"
                      >
                        <span>{emoji}</span>
                        {label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Results */}
                {chatStep === "results" && assistantResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-1.5 pl-8"
                  >
                    {assistantResults.map((match, i) => {
                      const cat = SERVICE_CATEGORIES.find((c) => c.id === match.categoryId);
                      if (!cat) return null;
                      const Icon = cat.icon;
                      const topPartner = PARTNERS.find((p) => p.category === match.categoryId);
                      const isTop = i === 0;
                      return (
                        <motion.button
                          key={match.categoryId}
                          initial={{ opacity: 0, x: -8, scale: 0.97 }}
                          animate={{ opacity: 1, x: 0, scale: isTop ? 1.02 : 1 }}
                          transition={{ delay: i * 0.09, type: "spring", stiffness: 300, damping: 24 }}
                          whileHover={{ scale: isTop ? 1.04 : 1.02, boxShadow: "0 6px 20px rgba(99,102,241,0.18)" }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setSelectedCategory(match.categoryId);
                            closeAssistant();
                            if (topPartner) {
                              handleRequestService(topPartner);
                              setRequestForm((prev) => ({
                                ...prev,
                                category: match.categoryId,
                                description: chatMessages.filter((m) => m.from === "user").slice(-1)[0]?.text || "",
                              }));
                            }
                          }}
                          className={`w-full flex items-center gap-2.5 bg-white rounded-xl px-3 py-2 text-left group transition-all ${
                            isTop
                              ? "border-2 border-indigo-300 shadow-md shadow-indigo-100"
                              : "border border-gray-100 hover:border-indigo-200 hover:shadow-sm"
                          }`}
                        >
                          <div className={`w-7 h-7 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0`}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900">{cat.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{match.reason}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isTop && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Top Match</span>
                            )}
                            <ChevronRightIcon className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 transition" />
                          </div>
                        </motion.button>
                      );
                    })}
                    <button
                      onClick={() => {
                        setChatStep("greeting");
                        setChatMessages([{ from: "bot", text: "Anything else I can help with? 😊", typewriter: true }]);
                        setAssistantResults([]);
                      }}
                      className="text-[10px] text-indigo-500 hover:text-indigo-700 transition pl-1"
                    >
                      ← Start over
                    </button>
                  </motion.div>
                )}

                {/* Error retry */}
                {chatStep === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pl-8 flex items-center gap-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setChatStep("awaiting_input")}
                      className="text-xs text-indigo-600 border border-indigo-200 rounded-xl px-3 py-1.5 hover:bg-indigo-50 hover:border-indigo-400 transition shadow-sm"
                    >
                      Try again
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Input area */}
              <AnimatePresence>
                {chatStep === "awaiting_input" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className="px-3 pb-3 pt-2 border-t border-gray-100 flex-shrink-0 space-y-2 bg-gray-50/60"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {["AC not working", "Laptop repair", "House cleaning", "Dog grooming", "Catering"].map((ex) => (
                        <motion.button
                          key={ex}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAssistantQuery(ex)}
                          className="px-2 py-0.5 rounded-full bg-white border border-indigo-200 text-[10px] text-indigo-600 font-medium hover:bg-indigo-50 hover:border-indigo-400 transition shadow-sm"
                        >
                          {ex}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={assistantQuery}
                        onChange={(e) => setAssistantQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && runSmartAssistant()}
                        placeholder="Describe your issue..."
                        className="flex-1 px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.08, boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}
                        whileTap={{ scale: 0.92 }}
                        onClick={runSmartAssistant}
                        disabled={!assistantQuery.trim()}
                        className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 shadow"
                      >
                        <SendHorizonal className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating trigger button */}
        <motion.button
          onClick={() => assistantOpen ? closeAssistant() : openAssistant()}
          whileHover={{ scale: 1.12, boxShadow: "0 8px 30px rgba(99,102,241,0.5)" }}
          whileTap={{ scale: 0.9 }}
          animate={assistantOpen ? {} : {
            boxShadow: [
              "0 0 0 0 rgba(99,102,241,0.5)",
              "0 0 0 14px rgba(99,102,241,0)",
              "0 0 0 0 rgba(99,102,241,0)",
            ],
          }}
          transition={assistantOpen ? {} : { duration: 2.2, repeat: Infinity }}
          className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-xl text-white"
          aria-label="Open Smart Assistant"
        >
          <AnimatePresence mode="wait">
            {assistantOpen
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }}>
                  <X className="w-6 h-6" />
                </motion.span>
              : <motion.span key="bot" initial={{ rotate: 90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }}>
                  <Sparkles className="w-6 h-6" />
                </motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </div>

    </div>
  );
}
