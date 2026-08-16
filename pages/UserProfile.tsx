import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  UserRound,
  ShieldCheck,
  BriefcaseMedical,
  Stethoscope,
  Activity,
  Building2,
  Award,
  CheckCircle2,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type UserRole =
  | "doctor"
  | "admin"
  | "sub_admin"
  | "assistant"
  | "receptionist"
  | "pharmacist"
  | "accountant"
  | "staff"
  | "other";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string;
  roleName: UserRole;
  department: string;
  experience: string;
  designation: string;
}

// ============================================================
// ROLE CONFIG
// ============================================================

const roleConfig: Record<
  UserRole,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
  }
> = {
  doctor: {
    label: "Doctor",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: <Stethoscope size={15} />,
  },

  admin: {
    label: "Administrator",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    icon: <ShieldCheck size={15} />,
  },

  sub_admin: {
    label: "Sub Admin",
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    icon: <ShieldCheck size={15} />,
  },

  assistant: {
    label: "Dental Assistant",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    icon: <BriefcaseMedical size={15} />,
  },

  receptionist: {
    label: "Receptionist",
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    icon: <UserRound size={15} />,
  },

  pharmacist: {
    label: "Pharmacist",
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    icon: <BriefcaseMedical size={15} />,
  },

  accountant: {
    label: "Accountant",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-500/10",
    icon: <Activity size={15} />,
  },

  staff: {
    label: "Staff",
    color: "text-slate-600",
    bg: "bg-slate-100 dark:bg-slate-800",
    icon: <UserRound size={15} />,
  },

  other: {
    label: "User",
    color: "text-slate-600",
    bg: "bg-slate-100 dark:bg-slate-800",
    icon: <UserRound size={15} />,
  },
};

// ============================================================
// COMPONENT
// ============================================================

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  console.log('user : ',user);
  

  // ==========================================================
  // GET USER FROM LOCAL STORAGE
  // ==========================================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        console.warn("No user found in localStorage");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      console.log("User from localStorage:", parsedUser);

      setUser(parsedUser.user);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-sm font-semibold text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ROLE
  // ==========================================================

  const roleKey: UserRole =
    user.roleName && user.roleName in roleConfig
      ? user.roleName
      : "other";

  const role = roleConfig[roleKey];

  // ==========================================================
  // INITIALS
  // ==========================================================

  const getInitials = (name: string) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ====================================================
            PROFILE HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            rounded-3xl
            p-6
            md:p-8
            shadow-sm
          "
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Avatar */}

            <div
              className="
                w-24
                h-24
                rounded-2xl
                bg-gradient-to-br
                from-primary-500
                to-cyan-500
                flex
                items-center
                justify-center
                text-white
                text-3xl
                font-black
                shadow-lg
                shrink-0
              "
            >
              {getInitials(user.name)}
            </div>

            {/* User Basic Info */}

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="
                    text-2xl
                    md:text-3xl
                    font-black
                    text-slate-900
                    dark:text-white
                  "
                >
                  {user.name}
                </h1>

                <CheckCircle2
                  size={19}
                  className="text-emerald-500"
                />
              </div>

              <p className="text-sm text-slate-400 mt-1">
                {user.email}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-1.5
                    rounded-full
                    text-xs
                    font-bold
                    ${role.bg}
                    ${role.color}
                  `}
                >
                  {role.icon}
                  {role.label}
                </span>

                {user.designation && (
                  <span className="text-xs text-slate-500">
                    • {user.designation}
                  </span>
                )}

              </div>
            </div>

          </div>
        </motion.div>

        {/* ====================================================
            ACCOUNT INFORMATION
        ===================================================== */}

        <ProfileSection
          title="Account Information"
          description="Basic information associated with your account"
          icon={<UserRound size={20} />}
        >
          <InfoRow
            icon={<UserRound size={18} />}
            label="Full Name"
            value={user.name || "Not specified"}
          />

          <InfoRow
            icon={<Mail size={18} />}
            label="Email Address"
            value={user.email || "Not specified"}
          />

          <InfoRow
            icon={<ShieldCheck size={18} />}
            label="Account Role"
            value={role.label}
          />
        </ProfileSection>

        {/* ====================================================
            PROFESSIONAL INFORMATION
        ===================================================== */}

        <ProfileSection
          title="Professional Information"
          description="Your role and professional details"
          icon={<BriefcaseMedical size={20} />}
        >
          <InfoRow
            icon={<Award size={18} />}
            label="Designation"
            value={user.designation || "Not specified"}
          />

          <InfoRow
            icon={<Building2 size={18} />}
            label="Department"
            value={user.department || "Not specified"}
          />

          <InfoRow
            icon={<BriefcaseMedical size={18} />}
            label="Experience"
            value={
              user.experience
                ? `${user.experience} Years`
                : "Not specified"
            }
          />
        </ProfileSection>

        {/* ====================================================
            ACCESS INFORMATION
        ===================================================== */}

        <ProfileSection
          title="Access Information"
          description="System role and access identifiers"
          icon={<ShieldCheck size={20} />}
        >
          <InfoRow
            icon={<ShieldCheck size={18} />}
            label="Role"
            value={role.label}
          />

          <InfoRow
            icon={<Activity size={18} />}
            label="Role ID"
            value={user.roleId || "Not specified"}
          />

          <InfoRow
            icon={<UserRound size={18} />}
            label="User ID"
            value={user.id || "Not specified"}
          />
        </ProfileSection>

      </div>
    </div>
  );
};

// ============================================================
// PROFILE SECTION
// ============================================================

const ProfileSection = ({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        bg-white
        dark:bg-slate-900
        border
        border-slate-200
        dark:border-slate-800
        rounded-3xl
        shadow-sm
        overflow-hidden
      "
    >

      {/* Section Header */}

      <div
        className="
          flex
          items-center
          gap-3
          px-6
          py-5
          border-b
          border-slate-100
          dark:border-slate-800
        "
      >
        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-primary-50
            dark:bg-primary-500/10
            text-primary-600
            flex
            items-center
            justify-center
          "
        >
          {icon}
        </div>

        <div>
          <h2
            className="
              text-base
              font-black
              text-slate-900
              dark:text-white
            "
          >
            {title}
          </h2>

          <p className="text-xs text-slate-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>

      {/* Section Content */}

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {children}
      </div>

    </motion.div>
  );
};

// ============================================================
// INFO ROW
// ============================================================

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        px-6
        py-5
        hover:bg-slate-50
        dark:hover:bg-slate-800/40
        transition
      "
    >

      {/* Icon */}

      <div
        className="
          w-10
          h-10
          rounded-xl
          bg-slate-100
          dark:bg-slate-800
          text-slate-500
          dark:text-slate-300
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {icon}
      </div>

      {/* Content */}

      <div className="flex-1 min-w-0">

        <p
          className="
            text-[10px]
            uppercase
            tracking-widest
            font-bold
            text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            text-sm
            md:text-base
            font-semibold
            text-slate-800
            dark:text-white
            mt-1
            break-words
          "
        >
          {value}
        </p>

      </div>
    </div>
  );
};

export default UserProfile;