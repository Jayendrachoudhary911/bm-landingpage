import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  alpha,
  Divider,
  Button,
  Chip,
  SwipeableDrawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import EmergencyShareRoundedIcon from "@mui/icons-material/EmergencyShareRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import LockPersonRoundedIcon from "@mui/icons-material/LockPersonRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import HowToVoteRoundedIcon from "@mui/icons-material/HowToVoteRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import { useCustomTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const M3_EXPRESSIVE_PALETTE = {
  purple: {
    accent: "#c8b6ff",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(75, 36, 140, 0.55) 0%, #09090b 75%)",
    light: { bg: "#EBDCFF", text: "#25005A", container: "#F6EEFF", onContainer: "#6940A5", badgeBg: "#D4BFF2" },
    dark: { bg: "#e2d1ff", text: "#44236f", container: "#ecdeff", onContainer: "#a473ff", badgeBg: "#422271" },
  },
  blue: {
    accent: "#88b7f0",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, #0e346e8c 0%, #09090b 75%)",
    light: { bg: "#D7E3FF", text: "#001B3F", container: "#EEF2FF", onContainer: "#004785", badgeBg: "#BACDF8" },
    dark: { bg: "#d3e7ff", text: "#2c4688", container: "#e2f0ff", onContainer: "#457ed8", badgeBg: "#003F7D" },
  },
  emerald: {
    accent: "#8cefcb",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(0, 85, 42, 0.55) 0%, #09090b 75%)",
    light: { bg: "#A6F5BA", text: "#00210E", container: "#DBFCE3", onContainer: "#006D37", badgeBg: "#8CE3A3" },
    dark: { bg: "#b6ffd7", text: "#21542e", container: "#e4fff0", onContainer: "#17c14d", badgeBg: "#005228" },
  },
  orange: {
    accent: "#ffd6b4",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(115, 45, 0, 0.55) 0%, #09090b 75%)",
    light: { bg: "#FFDBCA", text: "#341000", container: "#FFECE2", onContainer: "#984013", badgeBg: "#F6C1A7" },
    dark: { bg: "#ffdac5", text: "#703e26", container: "#ffeae2", onContainer: "#fb712c", badgeBg: "#772F03" },
  },
  amber: {
    accent: "#f5d397",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(110, 75, 0, 0.55) 0%, #09090b 75%)",
    light: { bg: "#FFDEA5", text: "#271900", container: "#FFF2D9", onContainer: "#765B00", badgeBg: "#F0CA85" },
    dark: { bg: "#ffefbe", text: "#634b21", container: "#fff5e2", onContainer: "#d99f17", badgeBg: "#594300" },
  },
};

const FEATURE_CATEGORIES = [
  { id: "all", label: "All Capabilities", palette: M3_EXPRESSIVE_PALETTE.purple },
  { id: "plan", label: "Planning & Timeline", palette: M3_EXPRESSIVE_PALETTE.blue },
  { id: "manage", label: "Finance & Documents", palette: M3_EXPRESSIVE_PALETTE.orange },
  { id: "connect", label: "Messaging & Social", palette: M3_EXPRESSIVE_PALETTE.purple },
  { id: "travel", label: "Maps & Offline", palette: M3_EXPRESSIVE_PALETTE.emerald },
  { id: "security", label: "Privacy & Sync", palette: M3_EXPRESSIVE_PALETTE.amber },
];

const TAG_PALETTES = [
  M3_EXPRESSIVE_PALETTE.purple,
  M3_EXPRESSIVE_PALETTE.blue,
  M3_EXPRESSIVE_PALETTE.emerald,
  M3_EXPRESSIVE_PALETTE.orange,
  M3_EXPRESSIVE_PALETTE.amber,
];

const LIVE_FEATURES = [
  {
    id: "itinerary-timeline",
    category: "plan",
    type: "ITINERARY",
    status: "Live in Production",
    icon: MapRoundedIcon,
    title: "Day-by-Day Collaborative Timeline",
    desc: "Hour-by-hour itinerary coordination with stay duration buffers, stop notes, transit allocations, and member milestone markers.",
    longDescription:
      "The central command station of every journey. Squads organize daily schedules hour-by-hour with custom location pins, activity tags, notes, and cost estimations. Real-time multi-user syncing ensures everyone has the exact schedule on their personal devices.",
    palette: M3_EXPRESSIVE_PALETTE.blue,
    tags: ["Day-Wise Timelines", "Transit Calculations", "Milestone Tracking"],
    capabilities: [
      "Day-by-day chronological scheduling with custom time slots",
      "Integrated transit duration estimates between waypoints",
      "Member assignment to specific stops and booking milestones",
      "One-tap redirection to Google Maps for turn-by-turn navigation",
    ],
  },
  {
    id: "debt-splitting",
    category: "manage",
    type: "FINANCE",
    status: "Live in Production",
    icon: PaymentsRoundedIcon,
    title: "Budget Manager & Split Engine",
    desc: "End-to-end squad ledger tracking equal and weighted expense splits, debt simplification suggestions, and receipt documentation.",
    longDescription:
      "Say goodbye to post-trip bill balancing headaches. Add hotel bookings, dinners, and toll expenses in seconds with attached receipts. BunkMates calculates the mathematical minimum number of transactions needed to settle all balances among co-travelers.",
    palette: M3_EXPRESSIVE_PALETTE.orange,
    tags: ["Debt Simplifier", "Multi-Currency Splits", "Expense Charts"],
    capabilities: [
      "Equal, custom, and weighted expense distribution across co-travelers",
      "Smart debt-minimization algorithm showing exact 'who owes whom'",
      "Categorized expense visualizer and real-time budget depletion charts",
      "Instant PDF & CSV expense report exports for transparent settlements",
    ],
  },
  {
    id: "squad-messaging",
    category: "connect",
    type: "COMMUNICATION",
    status: "Live in Production",
    icon: ForumRoundedIcon,
    title: "Squad Messaging & Secret Rooms",
    desc: "Contextual group messaging tied directly to itinerary milestones with full media viewers, voice notes, and hidden private rooms.",
    longDescription:
      "Communicate without fragmentation. Squad chats keep all trip discussions in one dedicated hub. Share voice notes, media, and location drops while receiving automated system updates whenever itinerary stops change or new bills are logged.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
    tags: ["Secret Chat Rooms", "Voice Notes & Media", "Contextual Threading"],
    capabilities: [
      "Group chats and private hidden channels for confidential squad planning",
      "Embedded voice notes and high-resolution photo viewer",
      "Dynamic message grouping within configurable time windows",
      "Context threads tied directly to itinerary stops and expense alerts",
    ],
  },
  {
    id: "qr-invitations",
    category: "connect",
    type: "INVITATIONS",
    status: "Live in Production",
    icon: QrCodeScannerRoundedIcon,
    title: "Instant QR & Shareable Invites",
    desc: "One-tap trip joining via secure QR codes, revocable invite links, and granular member management with custom host permissions.",
    longDescription:
      "Onboard your entire group in seconds. Simply display your trip's dedicated QR code for friends to scan with their camera, or share protected invite links that auto-enroll members into the shared chat, itinerary, and ledger.",
    palette: M3_EXPRESSIVE_PALETTE.amber,
    tags: ["Scan to Join QR", "Time-Limited Invites", "Host Admin Controls"],
    capabilities: [
      "Generate custom QR codes for frictionless in-person trip onboarding",
      "Shareable, time-limited invite links with revocable access tokens",
      "Granular member permissions: Co-host, Editor, or Viewer roles",
      "Instant member avatar sync with profile cropping and zoom tools",
    ],
  },
  {
    id: "offline-pwa",
    category: "travel",
    type: "OFFLINE READY",
    status: "Live in Production",
    icon: CloudOffRoundedIcon,
    title: "PWA Offline Caching & Vaults",
    desc: "Full Progressive Web App capabilities enabling offline notes, cached itinerary viewing, and local persistence off-grid.",
    longDescription:
      "Travel deep into mountain valleys or remote islands without losing critical information. BunkMates caches all itinerary waypoints, ticket bookings, and squad tasks on-device, automatically resolving data updates the moment connectivity is restored.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
    tags: ["Zero-Signal Notes", "Local Pass Storage", "Auto Reconnect Sync"],
    capabilities: [
      "Installable PWA experience with native-level performance across iOS and Android",
      "Offline access to all loaded itineraries, hotel vouchers, and split ledgers",
      "Locally cached notes and checklist interactions with background synchronization",
      "Zero battery drain background conflict-handling protocols",
    ],
  },
  {
    id: "weather-maps",
    category: "travel",
    type: "WEATHER & MAPS",
    status: "Live in Production",
    icon: WbSunnyRoundedIcon,
    title: "Weather Intelligence & Nearby Hub",
    desc: "Live travel forecasts, trip-date weather timelines, and Google Maps integrations identifying top attractions and transit hubs.",
    longDescription:
      "Stay ahead of shifting forecasts. Receive proactive alerts if rain or temperature drops are anticipated on excursion days, paired with an integrated discovery hub that surfaces top-rated stops around your stay duration.",
    palette: M3_EXPRESSIVE_PALETTE.blue,
    tags: ["Travel Day Forecasts", "Attraction Discovery", "Maps Redirection"],
    capabilities: [
      "Live multi-day weather timeline tailored to each trip's scheduled dates",
      "Dynamic weather-based packing and schedule adjustment alerts",
      "Curated nearby attraction discovery for food, viewpoints, and fuel",
      "Seamless single-tap coordinates bridge to Google Maps and navigation tools",
    ],
  },
  {
    id: "task-management",
    category: "plan",
    type: "PRODUCTIVITY",
    status: "Live in Production",
    icon: ChecklistRoundedIcon,
    title: "To-Dos & Action Boards",
    desc: "Categorized checklists with due dates, priority markers, and completion tracking so squads never miss a departure window.",
    longDescription:
      "Eliminate scattered mental notes. Organize everything from vehicle rentals to visa submissions into clear prioritized task boards where squad members claim duties and track progress together.",
    palette: M3_EXPRESSIVE_PALETTE.amber,
    tags: ["Priority Tags", "Completion Badges", "Custom Reminders"],
    capabilities: [
      "Create, assign, and prioritize pre-trip preparations and tickets",
      "Due date notifications and automated deadline reminders",
      "Categorized task bins (Transport, Stays, Gear, Documentation)",
      "Instant progress indicators tracking squad readiness percentage",
    ],
  },
  {
    id: "notes-documents",
    category: "plan",
    type: "COLLABORATION",
    status: "Live in Production",
    icon: DescriptionRoundedIcon,
    title: "Shared Notes & Travel Vaults",
    desc: "Collaborative rich-text note editor supporting embedded media, voice recordings, and secure travel document storage for tickets and IDs.",
    longDescription:
      "A centralized digital binder for all your journey's essential files. Store boarding passes, hotel confirmations, and custom group notes with sandboxed security, ready to view in high resolution anywhere.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
    tags: ["Embedded Voice Notes", "Document Storage", "PDF Exports"],
    capabilities: [
      "Collaborative rich-text notes with real-time squad co-editing",
      "Voice notes and image embeds attached directly into note cards",
      "Dedicated sandboxed vault for boarding passes, train tickets, and stay bookings",
      "Instant PDF compilation of complete trip summaries and itineraries",
    ],
  },
  {
    id: "calendar-sync",
    category: "manage",
    type: "CALENDAR",
    status: "Live in Production",
    icon: CalendarMonthRoundedIcon,
    title: "Squad Availability & Calendar",
    desc: "Integrated scheduling grid detecting timeline conflicts, stay duration alignment, and direct calendar export capabilities.",
    longDescription:
      "Align schedules without endless back-and-forth messaging. View co-traveler availability windows, match trip dates with holidays, and sync the finalized agenda directly into external calendar apps with one click.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
    tags: ["Stay Scheduling", "Conflict Check", "Calendar Integration"],
    capabilities: [
      "In-app calendar view showing multi-trip schedules and stay durations",
      "Automated schedule conflict detection across overlapping activities",
      "Member availability overlays for effortless departure date picking",
      "Direct Google Calendar and iCal sync exports",
    ],
  },
  {
    id: "media-gallery",
    category: "connect",
    type: "MEDIA & MEMORIES",
    status: "Live in Production",
    icon: PhotoLibraryRoundedIcon,
    title: "Shared Photo Vault & Albums",
    desc: "Full-resolution shared photo vaults, automatic timestamp grouping, and downloadable high-res collective albums.",
    longDescription:
      "Keep trip moments intact long after returning home. Every squad member can drop photos and videos into a unified high-resolution album indexed by itinerary milestones.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
    tags: ["Full-Res Photo Vault", "Auto Time Grouping", "Trip Recap Generator"],
    capabilities: [
      "Centralized media hub preserving original image quality across uploads",
      "Automatic chronological clustering tied to itinerary landmarks",
      "One-tap bulk media download for all trip participants",
      "Interactive full-screen viewer with zooming and pan gestures",
    ],
  },
  {
    id: "account-profiles",
    category: "security",
    type: "IDENTITY",
    status: "Live in Production",
    icon: ManageAccountsRoundedIcon,
    title: "Profile Studio & Avatar Cropping",
    desc: "Customizable profile avatars with cropping and zoom controls, session tracking, and multi-device authentication safety.",
    longDescription:
      "Manage your traveler identity and account security in one place. Customize your public badge, manage active login sessions across devices, and enforce two-factor protection.",
    palette: M3_EXPRESSIVE_PALETTE.orange,
    tags: ["Avatar Studio", "Active Device Log", "2-Factor Auth"],
    capabilities: [
      "High-precision circular avatar cropping and zoom adjustment tools",
      "Active login session inspect and remote sign-out across all devices",
      "Two-factor authentication (2FA) and biometric login integration",
      "Granular notification preferences and quiet hour schedules",
    ],
  },
  {
    id: "export-reports",
    category: "manage",
    type: "EXPORT & SHARE",
    status: "Live in Production",
    icon: ShareRoundedIcon,
    title: "Trip Summary & PDF Compilers",
    desc: "Generate print-ready itinerary documents, itemized expense split summaries, and packing lists with one click.",
    longDescription:
      "Take your trip documentation anywhere. Compile itineraries and balanced expenditure ledgers into PDF documents ideal for printouts or sharing with non-app users.",
    palette: M3_EXPRESSIVE_PALETTE.amber,
    tags: ["PDF Export Engine", "CSV Ledgers", "Public Summary Links"],
    capabilities: [
      "Export comprehensive trip summary brochures with daily schedules",
      "Compile certified expense breakdown reports formatted for tax or split claims",
      "Shareable read-only web links for family and non-app travelers",
      "Export checklists to PDF or plain-text clipboard copies",
    ],
  },
  {
    id: "global-search",
    category: "security",
    type: "SEARCH",
    status: "Live in Production",
    icon: SearchRoundedIcon,
    title: "Unified Global Search Engine",
    desc: "Instant search across all trips, squad chats, expense titles, member names, checklists, and document attachments.",
    longDescription:
      "Find any travel detail in milliseconds. Whether locating a receipt from three months ago or searching for a specific stop name in your group chat, global search indexes your entire travel workspace.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
    tags: ["Cross-System Query", "Expense Filter", "Instant Chat Search"],
    capabilities: [
      "Unified search bar querying trips, tasks, files, and chat logs simultaneously",
      "Filter queries by expense categories, date spans, or squad contributors",
      "Deep text indexing inside collaborative rich-text notes",
      "Keyboard shortcut access for lightning-fast desktop planning",
    ],
  },
  {
    id: "realtime-sync",
    category: "security",
    type: "SYNC ENGINE",
    status: "Live in Production",
    icon: SyncRoundedIcon,
    title: "Conflict-Free Real-Time Engine",
    desc: "Real-time state synchronization across web, mobile, and tablets with automatic multi-editor conflict resolution.",
    longDescription:
      "Experience frictionless real-time collaboration. When a squad mate adds an expense or reschedules a stop, changes appear across every connected device instantly with zero lag.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
    tags: ["Sub-Second Latency", "Offline-First Sync", "Auto Conflict Merge"],
    capabilities: [
      "Instant push updates across all connected devices using Firebase WebSockets",
      "Automated timestamp-based conflict merging during simultaneous edits",
      "Minimal cellular data consumption optimized for roaming connections",
      "Background sync triggers when re-entering network coverage zones",
    ],
  },
  {
    id: "privacy-controls",
    category: "security",
    type: "SECURITY",
    status: "Live in Production",
    icon: LockPersonRoundedIcon,
    title: "Zero-Trust Privacy & Governance",
    desc: "Granular trip visibility settings, hidden chat rooms, member blocking, and full compliance data export options.",
    longDescription:
      "Your travel plans are confidential. BunkMates gives you full control over who sees your itineraries, locks private chats behind secondary pins, and guarantees zero personal data monetization.",
    palette: M3_EXPRESSIVE_PALETTE.blue,
    tags: ["Hidden Chat Vaults", "Zero Data Selling", "Full Data Export"],
    capabilities: [
      "Trip visibility toggles: Public, Unlisted, or Secret Squad-Only",
      "Hidden chat room encryption with optional secondary passcode lock",
      "Strict data isolation ensuring zero sharing with advertising brokers",
      "One-click complete account and trip data erasure mechanisms",
    ],
  },
  {
    id: "notifications-engine",
    category: "travel",
    type: "ALERTS",
    status: "Live in Production",
    icon: NotificationsActiveRoundedIcon,
    title: "Smart Departure & Cost Alerts",
    desc: "Real-time push notifications for itinerary modifications, debt settlement reminders, and scheduled departure countdowns.",
    longDescription:
      "Never miss a flight or boarding window. BunkMates sends timely, categorized push reminders for upcoming stops, newly logged group expenses, and unfulfilled checklist duties.",
    palette: M3_EXPRESSIVE_PALETTE.orange,
    tags: ["Departure Timers", "Split Reminders", "Quiet Hours Control"],
    capabilities: [
      "Custom countdown notifications prior to key travel milestones",
      "Instant alerts when expenses are added or balanced by co-explorers",
      "Configurable quiet hours and muted channel options",
      "System push integration across Android, iOS, and PWA browsers",
    ],
  },
  {
    id: "theme-engine",
    category: "security",
    type: "CUSTOMIZATION",
    status: "Live in Production",
    icon: PaletteRoundedIcon,
    title: "Expressive Theme Engine",
    desc: "Dynamic light, dark, and system theme switching powered by Google M3 color tokens with custom ambient glow backdrops.",
    longDescription:
      "Personalize your planning atmosphere. Choose between ultra-dark glassmorphism, crisp light modes, or automatic OS-synchronized color schemes tailored for high contrast readability.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
    tags: ["M3 Color Engine", "Glassmorphism Themes", "Reduced Motion"],
    capabilities: [
      "Seamless instant light/dark toggle without page reloads",
      "M3 expressive color tokens across all UI modules",
      "Reduced motion mode for battery optimization and accessibility",
      "Dynamic ambient gradient accents tuned to active color palettes",
    ],
  },
  {
    id: "voice-notes",
    category: "connect",
    type: "VOICE ENGINE",
    status: "Live in Production",
    icon: MicRoundedIcon,
    title: "In-App Voice Notes & Memos",
    desc: "Record, share, and playback voice notes inside squad chats and shared note cards with native waveform visualization.",
    longDescription:
      "When typing on the move is difficult, record quick voice memos that automatically upload to the squad channel with integrated playback and duration tracking.",
    palette: M3_EXPRESSIVE_PALETTE.blue,
    tags: ["Waveform Player", "Voice Memos", "High-Fidelity Audio"],
    capabilities: [
      "One-touch voice recording with pause and resume tools",
      "Automatic audio compression minimizing cellular data usage",
      "Waveform scrubbing and variable playback speed controls",
      "Embed voice memos directly into itinerary day notes",
    ],
  },
  {
    id: "trip-cloning",
    category: "plan",
    type: "TEMPLATES",
    status: "Live in Production",
    icon: RouteRoundedIcon,
    title: "Trip Cloning & Duplication",
    desc: "Duplicate past successful trips into fresh planning workspaces with preserved stops, packing lists, and custom note structures.",
    longDescription:
      "Reuse your best travel routes without starting from scratch. Clone complete past itineraries, modify dates and members, and launch your next trip in seconds.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
    tags: ["One-Click Duplicate", "Reusable Templates", "Saved Routes"],
    capabilities: [
      "Clone full day-by-day schedules with one click",
      "Option to copy packing checklists while resetting completion checks",
      "Preserve custom waypoint tags and stay duration estimates",
      "Quick re-assignment of squad members to imported stops",
    ],
  },
  {
    id: "multi-trip-hub",
    category: "plan",
    type: "OVERVIEW",
    status: "Live in Production",
    icon: TravelExploreRoundedIcon,
    title: "Multi-Trip Dashboard & History",
    desc: "Comprehensive dashboard managing active, upcoming, and archived journeys with quick-switch squad selector widgets.",
    longDescription:
      "Organize every past and future adventure in one space. Switch seamlessly between multiple upcoming journeys, archive completed trips, and keep details accessible.",
    palette: M3_EXPRESSIVE_PALETTE.amber,
    tags: ["Active Trip Cards", "Past Trip Archives", "Quick-Switch Hub"],
    capabilities: [
      "Card-based dashboard highlighting upcoming departure countdowns",
      "Complete historical archive preserving all receipts and chat logs",
      "Custom cover image uploads with in-app banner cropping",
      "Trip overview cards showing member count and total budget burn",
    ],
  },
];

const UPCOMING_ROADMAP_FEATURES = [
  {
    id: "ai-planner",
    category: "ai",
    type: "AI ARCHITECT",
    status: "Priority Roadmap",
    icon: SmartToyRoundedIcon,
    title: "AI Trip Architect & Consensus Engine",
    desc: "Natural-language itinerary generation, automated budget calculations, and group voting synthesis directly inside squad chats.",
    longDescription:
      "Transform free-form conversational requests (e.g. 'Plan a 4-day Jaipur trip for 6 people under ₹8,000 each') into structured schedules. The AI Trip Architect analyzes member preferences, synthesizes group chats to detect voting majorities, calculates live budget forecasts, and delivers tailored activity recommendations directly into your timeline.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
    tags: ["Natural Language Routing", "Auto Budget Estimator", "Group Consensus Engine"],
    capabilities: [
      "Natural prompt understanding for complex budget & duration constraints",
      "Automatic parsing of squad chat messages to extract group consensus",
      "Dynamic activity and transit time calculation with rest buffers",
      "Instant export to live collaborative editable itineraries",
    ],
  },
  {
    id: "smart-packing",
    category: "plan",
    type: "PACKING AI",
    status: "Priority Roadmap",
    icon: LuggageRoundedIcon,
    title: "Smart Collaborative Packing Lists",
    desc: "Dynamic checklists generated from trip length, weather forecasts, and planned outdoor activities with live multi-member assignment.",
    longDescription:
      "Eliminate duplicate equipment and forgotten essentials. BunkMates Smart Packing examines the destination's live weather forecast, terrain type, and journey duration to auto-generate categorized checklists (Essentials, Clothing, Weather Gear, Electronics) where co-travelers can assign items and check them off in real-time.",
    palette: M3_EXPRESSIVE_PALETTE.emerald,
    tags: ["Weather-Aware Items", "Member Assignment", "Shared Essentials"],
    capabilities: [
      "Weather-aware clothing and gear suggestions automatically generated",
      "Assign mutual group items (tents, chargers, first-aid) to single members",
      "Collaborative live check-off indicators with squad completion %",
      "Offline checklist availability on all installable mobile clients",
    ],
  },
  {
    id: "emergency-safety",
    category: "travel",
    type: "SAFETY & EMERGENCY",
    status: "Upcoming Roadmap",
    icon: EmergencyShareRoundedIcon,
    title: "Emergency SOS & Safety Check-ins",
    desc: "One-tap emergency broadcast with localized emergency help numbers, real-time 'Reached Safely' squad confirmations, and live coordinate sharing.",
    longDescription:
      "Prioritizing explorer security on every venture. BunkMates integrates SOS broadcast triggers, offline-ready local emergency telephone directories, and prompt group check-in confirmations so organizers know every traveler is accounted for.",
    palette: M3_EXPRESSIVE_PALETTE.orange,
    tags: ["SOS Broadcast", "Safety Check-In", "Local Emergency Numbers"],
    capabilities: [
      "One-tap emergency alert dispatches coordinates to designated trusted contacts",
      "Pre-loaded regional emergency services (police, medical, mountain rescue)",
      "Squad check-in confirmations ('Reached hotel safely') with timestamp logs",
      "Live coordinate sharing with encrypted end-to-end delivery",
    ],
  },
  {
    id: "live-beacon",
    category: "travel",
    type: "LOCATION BEACON",
    status: "Upcoming Roadmap",
    icon: LocationOnRoundedIcon,
    title: "Live Squad Rendezvous & Beacons",
    desc: "Temporary opt-in location tracking during active trek days, festival excursions, and crowded landmark exploration.",
    longDescription:
      "Never lose track of your squad during busy festivals or sprawling nature treks. Enable battery-optimized live location beacons and set custom rendezvous pins that alert travelers when they drift apart.",
    palette: M3_EXPRESSIVE_PALETTE.blue,
    tags: ["Battery-Optimized Beacons", "Meeting Point Alerts", "Geo-Fenced Alerts"],
    capabilities: [
      "Temporary opt-in location sharing with automatic expiration timers",
      "Custom rendezvous checkpoint notifications for all squad members",
      "Low-bandwidth coordinate compression tailored for weak signals",
      "Proximity indicators showing distance to squad mates in meters",
    ],
  },
  {
    id: "chat-polls",
    category: "connect",
    type: "COLLABORATION",
    status: "Upcoming Roadmap",
    icon: HowToVoteRoundedIcon,
    title: "In-Chat Squad Polls & Decision Engine",
    desc: "Interactive polls inside group messages for restaurant picks, activity choices, and departure time selections.",
    longDescription:
      "Settle trip disagreements smoothly. Create instant multiple-choice polls inside squad channels with live vote visualizers, anonymous mode toggles, and auto-integration with itinerary slots.",
    palette: M3_EXPRESSIVE_PALETTE.amber,
    tags: ["Instant Chat Polls", "Live Vote Tally", "Auto-Schedule Winner"],
    capabilities: [
      "Multiple-choice and ranked voting modules inside chat threads",
      "Option to automatically book the winning activity into the timeline",
      "Anonymous voting toggles for sensitive budget agreements",
      "Push notification reminders for undecided squad members",
    ],
  },
  {
    id: "receipt-ocr",
    category: "manage",
    type: "AI VISION",
    status: "Upcoming Roadmap",
    icon: ReceiptLongRoundedIcon,
    title: "OCR Smart Receipt Scanning",
    desc: "Point your camera at restaurant bills or grocery receipts to auto-extract line items, taxes, and prices for instant member splitting.",
    longDescription:
      "Eliminate manual receipt typing. Snap a photo of any printed or digital bill; BunkMates OCR reads individual line items and lets co-explorers claim items with a single tap.",
    palette: M3_EXPRESSIVE_PALETTE.purple,
    tags: ["Itemized Receipt Scan", "Auto Tax Splitting", "Camera Scan Engine"],
    capabilities: [
      "High-speed machine vision parsing of printed invoices and receipts",
      "Individual line-item claiming across multiple co-diners",
      "Automatic proportional sales tax and gratuity calculations",
      "High-resolution receipt image attachment saved to expense ledgers",
    ],
  },
];

export default function FeaturesPage() {
  const { isDark } = useCustomTheme();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDrawerFeature, setActiveDrawerFeature] = useState(null);

  const purpleTheme = M3_EXPRESSIVE_PALETTE.purple;

  const colors = {
    background: isDark ? "#000000" : "#f1f3f5",
    surface: isDark ? "#0d0e12" : "#ffffff",
    surfaceInner: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
    surfaceHighlight: isDark ? "rgba(200, 182, 255, 0.07)" : "rgba(105, 64, 165, 0.04)",
    text: isDark ? "#ffffff" : "#09090b",
    secondaryText: isDark ? "#a1a1aa" : "#64748b",
  };

  const filteredFeatures =
    selectedCategory === "all"
      ? LIVE_FEATURES
      : LIVE_FEATURES.filter((f) => f.category === selectedCategory);

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: 12, sm: 14, md: 16 },
          pb: { xs: 8, md: 12 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        <Container maxWidth="lg">
          {/* Header Badge & Title */}
          <Box
            sx={{
              maxWidth: 840,
              mx: "auto",
              textAlign: "center",
              mb: { xs: 5, md: 7 },
            }}
          >

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
                lineHeight: 1.1,
                fontWeight: 850,
                letterSpacing: { xs: "-0.035em", md: "-0.05em" },
                color: "#e2d1ff",
                mb: 2,
              }}
            >
              Complete feature catalog for{" "}
              <Box
                component="span"
                sx={{
                  color: isDark ? "#8b76a8" : purpleTheme.light.onContainer,
                }}
              >
                squad exploration.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 700,
                mx: "auto",
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                lineHeight: 1.7,
                color: colors.secondaryText,
                mb: 3.5,
              }}
            >
              Explore all 20+ live systems and upcoming intelligent capabilities. Click any card to inspect full technical workflows, offline support, and squad architecture.
            </Typography>

            {/* Filter Category Chips */}
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ gap: 1 }}
            >
              {FEATURE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <Button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    sx={{
                      px: 2,
                      py: 0.65,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 750,
                      fontSize: "0.82rem",
                      backgroundColor: isSelected
                        ? isDark
                          ? purpleTheme.accent
                          : purpleTheme.light.onContainer
                        : colors.surfaceInner,
                      color: isSelected
                        ? isDark
                          ? "#25005A"
                          : "#ffffff"
                        : colors.secondaryText,
                      boxShadow: isSelected ? "0 4px 14px rgba(200, 182, 255, 0.25)" : "none",
                      "&:hover": {
                        backgroundColor: isSelected
                          ? purpleTheme.accent
                          : isDark
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    {cat.label}
                  </Button>
                );
              })}
            </Stack>
          </Box>

          {/* Section Header: Live Features */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                color: colors.text,
              }}
            >
              Live Features & Production Systems ({filteredFeatures.length})
            </Typography>
            <Chip
              label="20 Core Modules"
              size="small"
              sx={{
                fontSize: "0.72rem",
                fontWeight: 800,
                backgroundColor: isDark ? "rgba(140, 239, 203, 0.14)" : "#e6f9f0",
                color: isDark ? "#8cefcb" : "#006D37",
              }}
            />
          </Box>

          {/* 2x Grid with Cross-Diagonal Alternating Layout (Height: auto/content-aware) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              alignItems: "stretch",
              mb: 7,
            }}
          >
            {filteredFeatures.map((feature, idx) => {
              const Icon = feature.icon;

              const cardBg = isDark ? feature.palette.dark.bg : feature.palette.light.container;
              const cardTextColor = isDark ? feature.palette.dark.text : feature.palette.light.onContainer;

              const isIconLeft = Math.floor(idx / 2) % 2 === 0 ? idx % 2 === 0 : idx % 2 !== 0;

              return (
                <Box
                  key={feature.id || idx}
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.45, delay: (idx % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActiveDrawerFeature(feature)}
                  sx={{
                    height: "auto",
                    p: { xs: 3, sm: 3.5 },
                    borderRadius: "26px",
                    backgroundColor: cardBg,
                    cursor: "pointer",
                    boxShadow: isDark
                      ? "inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 16px 36px rgba(0, 0, 0, 0.45)"
                      : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 10px 28px rgba(0, 0, 0, 0.04)",
                    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: isDark
                        ? "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 20px 48px rgba(0, 0, 0, 0.6)"
                        : "inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 16px 36px rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  {/* Internal Alternating Row */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: isIconLeft ? "row" : "row-reverse",
                      },
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: { xs: 2.5, sm: 3 },
                      mb: 2.5,
                    }}
                  >
                    {/* Enlarged Icon Block */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "flex-start", sm: isIconLeft ? "flex-start" : "flex-end" },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 68, sm: 78 },
                          height: { xs: 68, sm: 78 },
                          borderRadius: "20px",
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: isDark ? alpha(feature.palette.accent, 0.28) : "#ffffff",
                          color: cardTextColor,
                          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <Icon sx={{ fontSize: { xs: 36, sm: 42 } }} />
                      </Box>
                    </Box>

                    {/* Details Column */}
                    <Box sx={{ flex: 1, textAlign: { xs: "left", sm: isIconLeft ? "left" : "right" } }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 850,
                          fontSize: "1.24rem",
                          letterSpacing: "-0.03em",
                          color: cardTextColor,
                          mb: 0.8,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          color: isDark ? alpha(cardTextColor, 0.88) : alpha(cardTextColor, 0.82),
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Footer Tags with Category Name & Inspect Trigger */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: isIconLeft ? "row" : "row-reverse" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "space-between",
                      gap: 1.5,
                      pt: 1.5,
                      borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.8}
                      flexWrap="wrap"
                      useFlexGap
                      justifyContent={{ xs: "flex-start", sm: isIconLeft ? "flex-start" : "flex-end" }}
                      sx={{ gap: 0.8 }}
                    >
                      {/* Category Chip Displayed with the Tags */}
                      <Chip
                        label={feature.type}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: "0.68rem",
                          fontWeight: 850,
                          letterSpacing: "0.05em",
                          borderRadius: "6px",
                          backgroundColor: isDark ? alpha(feature.palette.accent, 0.25) : "#ffffff",
                          color: cardTextColor,
                        }}
                      />

                      {feature.tags.slice(0, 2).map((tag, tIdx) => (
                        <Box
                          key={tIdx}
                          sx={{
                            px: 1.2,
                            py: 0.4,
                            borderRadius: "6px",
                            backgroundColor: isDark ? alpha("#000000", 0.22) : alpha("#ffffff", 0.6),
                            color: cardTextColor,
                            fontSize: "0.7rem",
                            fontWeight: 750,
                          }}
                        >
                          {tag}
                        </Box>
                      ))}
                    </Stack>

                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontSize: "0.76rem",
                        fontWeight: 800,
                        color: cardTextColor,
                        flexShrink: 0,
                      }}
                    >
                      <span>Inspect</span>
                      <ArrowOutwardRoundedIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Section Header: Upcoming & Planned Architecture */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                color: colors.text,
              }}
            >
              Upcoming Architecture & Roadmap Innovations
            </Typography>
            <Chip
              label="Next-Gen Roadmap"
              size="small"
              sx={{
                fontSize: "0.72rem",
                fontWeight: 800,
                backgroundColor: isDark ? "rgba(200, 182, 255, 0.15)" : "#f0e7ff",
                color: isDark ? purpleTheme.accent : "#6940A5",
              }}
            />
          </Box>

          {/* 4x Grid of Upcoming Roadmap Features */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2.5,
              alignItems: "stretch",
              mb: 7,
            }}
          >
            {UPCOMING_ROADMAP_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              const cardBg = isDark ? feature.palette.dark.bg : feature.palette.light.container;
              const cardTextColor = isDark ? feature.palette.dark.text : feature.palette.light.onContainer;

              return (
                <Box
                  key={feature.id || idx}
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.45, delay: (idx % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActiveDrawerFeature(feature)}
                  sx={{
                    height: "auto",
                    p: { xs: 2.8, sm: 3 },
                    borderRadius: "24px",
                    backgroundColor: cardBg,
                    cursor: "pointer",
                    boxShadow: isDark
                      ? "inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 16px 36px rgba(0, 0, 0, 0.45)"
                      : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 10px 28px rgba(0, 0, 0, 0.04)",
                    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: isDark
                        ? "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 20px 48px rgba(0, 0, 0, 0.6)"
                        : "inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 16px 36px rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2.5 }}>
                    {/* Top Row: Enlarged Icon & Category Tag */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box
                        sx={{
                          width: 58,
                          height: 58,
                          borderRadius: "18px",
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: isDark ? alpha(feature.palette.accent, 0.28) : "#ffffff",
                          color: cardTextColor,
                          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <Icon sx={{ fontSize: 32 }} />
                      </Box>

                      <Chip
                        label={feature.type}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.65rem",
                          fontWeight: 850,
                          letterSpacing: "0.05em",
                          borderRadius: "6px",
                          backgroundColor: isDark ? alpha(feature.palette.accent, 0.25) : "#ffffff",
                          color: cardTextColor,
                        }}
                      />
                    </Box>

                    {/* Details Block */}
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 850,
                          fontSize: "1.12rem",
                          letterSpacing: "-0.03em",
                          color: cardTextColor,
                          mb: 0.8,
                          lineHeight: 1.3,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          color: isDark ? alpha(cardTextColor, 0.88) : alpha(cardTextColor, 0.82),
                          lineHeight: 1.55,
                        }}
                      >
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Footer Tags & Inspect Trigger */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      pt: 1.5,
                      borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.4,
                        borderRadius: "6px",
                        backgroundColor: isDark ? alpha("#000000", 0.22) : alpha("#ffffff", 0.6),
                        color: cardTextColor,
                        fontSize: "0.7rem",
                        fontWeight: 750,
                        maxWidth: "65%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {feature.tags[0]}
                    </Box>

                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.4,
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        color: cardTextColor,
                        flexShrink: 0,
                      }}
                    >
                      <span>Inspect</span>
                      <ArrowOutwardRoundedIcon sx={{ fontSize: 13 }} />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Bottom Ecosystem CTA Card */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
              width: "100%",
              p: { xs: 3, sm: 4.5, md: 5 },
              borderRadius: { xs: "32px", sm: "34px", md: "36px" },
              backgroundColor: 'transparent',
              boxShadow: isDark
                ? "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 16px 40px rgba(0, 0, 0, 0.45)"
                : "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Ambient Radial Accent */}
            <Box
              sx={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: purpleTheme.ambientGradient,
                filter: "blur(40px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.1fr) minmax(0, 0.9fr)" },
                  gap: { xs: 4, md: 6 },
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 850,
                      letterSpacing: "-0.03em",
                      color: colors.text,
                      fontSize: { xs: "1.3rem", sm: "1.55rem" },
                      mb: 1.2,
                    }}
                  >
                    Start your squad's next chapter
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      color: colors.secondaryText,
                    }}
                  >
                    Experience real-time itinerary syncing, instant group split balances, and offline-first peace of mind on iOS, Android, and web.
                  </Typography>
                </Box>

                {/* Direct Action Hub */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: "20px",
                    backgroundColor: colors.surfaceInner,
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 800, color: colors.text, mb: 0.4 }}>
                    Ready to explore?
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: colors.secondaryText, lineHeight: 1.55, mb: 1.8 }}>
                    Create your first trip or join an existing squad in less than 30 seconds.
                  </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    <Button
                      onClick={() => navigate("/bm-install")}
                      startIcon={<DownloadRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        py: 0.7,
                        px: 2.2,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: "0.82rem",
                        backgroundColor: isDark ? purpleTheme.dark.bg : purpleTheme.light.bg,
                        color: isDark ? purpleTheme.dark.text : purpleTheme.light.text,
                        "&:hover": {
                          backgroundColor: purpleTheme.accent,
                          color: "#25005A",
                        },
                      }}
                    >
                      Install App
                    </Button>

                    <Button
                      onClick={() => navigate("/signup")}
                      endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        py: 0.7,
                        px: 2.2,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 750,
                        fontSize: "0.82rem",
                        backgroundColor: isDark ? "rgba(200, 182, 255, 0.07)" : "rgba(105, 64, 165, 0.04)",
                        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 16px 40px rgba(0, 0, 0, 0.45)",
                        color: colors.text,
                        "&:hover": {
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </Stack>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 3 }} />

              {/* Bottom Assurance Footer */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: colors.secondaryText, fontSize: "0.78rem" }}>
                  BunkMates v2.4 Platform Architecture · Discover, Plan, Connect & Manage.
                </Typography>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    onClick={() => navigate("/about")}
                    sx={{
                      px: 2,
                      py: 0.6,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 750,
                      fontSize: "0.8rem",
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: colors.text,
                      boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Our Mission
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Feature Details Responsive Drawer (Bottom Sheet on Mobile, Right Drawer on Desktop)[cite: 2] */}
      <SwipeableDrawer
        anchor={isDesktop ? "right" : "bottom"}
        open={Boolean(activeDrawerFeature)}
        onClose={() => setActiveDrawerFeature(null)}
        onOpen={() => {}}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(15, 23, 42, 0.2)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            },
          },
        }}
        PaperProps={{
          sx: {
            width: isDesktop ? { sm: 410, md: 540 } : "96%",
            maxHeight: isDesktop ? "100vh" : "90vh",
            height: isDesktop ? "100%" : "auto",
            borderRadius: isDesktop ? 0 : "28px",
            backgroundColor: isDark ? (isDesktop ? "#00000000" : "#ffffff10") : "#ffffff",
            color: colors.text,
            m: isDesktop ? 0 : 1,
            overflowY: "auto",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(255, 255, 255, 0.04)",
          },
        }}
      >
        <AnimatePresence mode="wait">
          {activeDrawerFeature && (
            <motion.div
              key={activeDrawerFeature.id}
              initial={
                isDesktop
                  ? { x: 120, scale: 0.92, opacity: 0 }
                  : { y: 60, opacity: 0 }
              }
              animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              exit={
                isDesktop
                  ? { x: 80, scale: 0.94, opacity: 0 }
                  : { y: 60, opacity: 0 }
              }
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: isDesktop ? "100%" : "auto",
                position: "relative",
                transformOrigin: isDesktop ? "right center" : "bottom center",
              }}
            >
              {/* Mobile Drag Indicator Bar[cite: 2] */}
              {!isDesktop && (
                <Box
                  sx={{
                    width: 38,
                    height: 4.5,
                    borderRadius: "999px",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                    mx: "auto",
                    mt: 1.5,
                    mb: 0.5,
                  }}
                />
              )}

              {/* Progressive Blur Sticky Top Bar[cite: 2] */}
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1200,
                  p: { xs: 2, sm: 3.5 },
                  pb: 1.5,
                  backgroundColor: isDark ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0.75)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Chip
                  label={activeDrawerFeature.type}
                  size="small"
                  sx={{
                    height: 26,
                    fontSize: "0.72rem",
                    fontWeight: 850,
                    letterSpacing: "0.06em",
                    borderRadius: "8px",
                    backgroundColor: isDark
                      ? activeDrawerFeature.palette.dark.bg
                      : activeDrawerFeature.palette.light.container,
                    color: isDark
                      ? activeDrawerFeature.palette.dark.text
                      : activeDrawerFeature.palette.light.onContainer,
                  }}
                />
                <IconButton
                  onClick={() => setActiveDrawerFeature(null)}
                  sx={{
                    color: colors.secondaryText,
                    display: isDesktop ? "block" : "none",
                    "&:hover": { color: colors.text },
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              {/* Drawer Body with Staggered Slide In[cite: 2] */}
              <Box sx={{ p: { xs: 2.5, sm: 4 }, pt: 1, pb: { xs: 4, sm: 4 }, flex: 1, display: "flex", flexDirection: "column" }}>
                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                >
                  <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 2.5 }}>
                    <Box
                      sx={{
                        width: { xs: 60, sm: 72 },
                        height: { xs: 60, sm: 72 },
                        borderRadius: "20px",
                        display: "grid",
                        placeItems: "center",
                        backgroundColor: isDark
                          ? activeDrawerFeature.palette.dark.bg
                          : activeDrawerFeature.palette.light.container,
                        color: isDark
                          ? activeDrawerFeature.palette.dark.text
                          : activeDrawerFeature.palette.light.onContainer,
                        flexShrink: 0,
                      }}
                    >
                      {React.createElement(activeDrawerFeature.icon, { sx: { fontSize: { xs: 32, sm: 38 } } })}
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 850, fontSize: { xs: "1.2rem", sm: "1.4rem" }, letterSpacing: "-0.03em" }}>
                        {activeDrawerFeature.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: colors.secondaryText }}>
                        System Status: {activeDrawerFeature.status}
                      </Typography>
                    </Box>
                  </Stack>
                </motion.div>

                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.12 }}
                >
                  <Typography sx={{ fontSize: "0.92rem", lineHeight: 1.75, color: colors.secondaryText, mb: 3 }}>
                    {activeDrawerFeature.longDescription}
                  </Typography>
                </motion.div>

                {/* Core Capabilities Breakdown[cite: 2] */}
                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.16 }}
                >
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 850, color: colors.text, mb: 1.5 }}>
                    Core Technical Capabilities
                  </Typography>

                  <Stack spacing={1.2} sx={{ mb: 3.5 }}>
                    {activeDrawerFeature.capabilities.map((cap, cIdx) => (
                      <Box
                        key={cIdx}
                        sx={{
                          p: 1.6,
                          borderRadius: "16px",
                          backgroundColor: "#ffffff11",
                          backdropFilter: "blur(20px)",
                          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(255, 255, 255, 0.06)",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.4,
                        }}
                      >
                        <CheckCircleRoundedIcon
                          sx={{
                            fontSize: 20,
                            color: activeDrawerFeature.palette.accent,
                            mt: 0.15,
                            flexShrink: 0,
                          }}
                        />
                        <Typography sx={{ fontSize: "0.84rem", lineHeight: 1.55, color: colors.text }}>
                          {cap}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </motion.div>

                {/* Action Button[cite: 2] */}
                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  style={{ marginTop: "auto" }}
                >
                  <Button
                    onClick={() => {
                      setActiveDrawerFeature(null);
                      navigate("/signup");
                    }}
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.3,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      boxShadow: "none",
                      backgroundColor: isDark
                        ? activeDrawerFeature.palette.dark.bg
                        : activeDrawerFeature.palette.light.container,
                      color: isDark
                        ? activeDrawerFeature.palette.dark.text
                        : activeDrawerFeature.palette.light.onContainer,
                      "&:hover": {
                        backgroundColor: activeDrawerFeature.palette.accent,
                        color: "#000000",
                      },
                    }}
                  >
                    Launch {activeDrawerFeature.title}
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </SwipeableDrawer>
    </Box>
  );
}