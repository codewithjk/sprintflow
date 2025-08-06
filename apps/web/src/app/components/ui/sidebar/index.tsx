import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  Building,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  MessagesSquareIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  Video,
  X,
} from "lucide-react";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useAuth } from "../../../features/auth/useAuth";
import { toast } from "react-toastify";
import { setIsSidebarCollapsed } from "../../../store/globalSlice";
import { Link, useLocation } from "react-router-dom";
import Image from "../images";
import { User as UserType } from "../../../../../../../libs/shared/types/src";
import { useProject } from "../../../features/project/useProject";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const { user, logOut } = useAuth();
  const { projects } = useProject();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      toast("unable to log out");
      console.error("Error signing out: ", error);
    }
  };
  if (!user) return null;
  const currentUserDetails: UserType = user;

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  const sidebarLinksByRole = {
    super_admin: [
      { icon: Home, label: "Home", href: "/admin/dashboard" },
      { icon: Building, label: "Organizations", href: "/admin/organizations" },
      { icon: Users, label: "Users", href: "/admin/users" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
    organization: [
      { icon: Home, label: "Home", href: "/org/dashboard" },
      { icon: Briefcase, label: "Projects", href: "/org/projects" },
      { icon: MessagesSquareIcon, label: "Chat", href: "/org/chat" },
      { icon: Video, label: "Meetings", href: "/org/meetings" },
      { icon: Users, label: "Members", href: "/org/members" },
      { icon: Settings, label: "Settings", href: "/org/settings" },
      
    ],
    user: [
      { icon: Home, label: "Home", href: "/home" },
      { icon: Briefcase, label: "Timeline", href: "/timeline" },
      { icon: MessagesSquareIcon, label: "Chat", href: "/chat" },
      { icon: Video, label: "Meetings", href: "/meetings" },
      { icon: Settings, label: "Settings", href: "/settings" },
      
    ],
  };
  const role = user.role as keyof typeof sidebarLinksByRole;
  const sidebarLinks = sidebarLinksByRole[role] || [];

  const priorities = [
    { label: "Urgent", href: "/priority/urgent", icon: AlertCircle },
    { label: "High", href: "/priority/high", icon: ShieldAlert },
    { label: "Medium", href: "/priority/medium", icon: AlertTriangle },
    { label: "Low", href: "/priority/low", icon: AlertOctagon },
    { label: "Backlog", href: "/priority/backlog", icon: Layers3 },
  ];

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              SPRINT
            </span>
            <span className="text-xl font-bold text-blue-800 dark:text-blue-500">
              {" "}
              FLOW
            </span>
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        {/* TEAM */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          {!!currentUserDetails?.profileUrl ? (
            <Image
              src={currentUserDetails?.profileUrl}
              alt={currentUserDetails?.name || "User Profile Picture"}
              width={50}
              height={50}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
          )}
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              {user.name}
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* NAVBAR LINKS */}
        {sidebarLinks.map(({ icon: Icon, label, href }) => (
          <SidebarLink key={href} icon={Icon} label={label} href={href} />
        ))}

               {role !== "super_admin" && (
  <>

        {/* PROJECTS LINKS */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* PROJECTS LIST */}
        {showProjects &&
          projects?.map((project) => (
            <SidebarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}

 
        {/* PRIORITIES LINKS */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            {priorities.map(({ label, href, icon }, index) => (
              <SidebarLink key={index} icon={icon} label={label} href={href} />
            ))}
          </>
            )}
              </>
)}
      </div>
      <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUserDetails?.profileUrl ? (
              <Image
                src={currentUserDetails?.profileUrl}
                alt={currentUserDetails?.name || "User Profile Picture"}
                width={50}
                height={50}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails?.name}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link to={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
