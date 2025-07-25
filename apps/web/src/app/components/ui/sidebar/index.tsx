



import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";


import  { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useAuth } from "../../../features/auth/useAuth";
import { toast } from "react-toastify";
import { setIsSidebarCollapsed } from "../../../store/globalSlice";
import { Link, useLocation } from "react-router-dom";
import Image from "../images";
import { User as UserType } from "../../../../../../../libs/shared/types/src";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  // const { data: projects } = useGetProjectsQuery();
  //todo : fetch projects
  const projects = [
  {
    "id": 1,
    "name": "Apollo",
    "description": "A space exploration project.",
    "startDate": "2023-01-01T00:00:00Z",
    "endDate": "2023-12-31T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Beacon",
    "description": "Developing advanced navigation systems.",
    "startDate": "2023-02-01T00:00:00Z",
    "endDate": "2023-10-15T00:00:00Z"
  },
  {
    "id": 3,
    "name": "Catalyst",
    "description": "A project to boost renewable energy use.",
    "startDate": "2023-03-05T00:00:00Z",
    "endDate": "2024-03-05T00:00:00Z"
  },
  {
    "id": 4,
    "name": "Delta",
    "description": "Delta project for new software development techniques.",
    "startDate": "2023-01-20T00:00:00Z",
    "endDate": "2023-09-20T00:00:00Z"
  },
  {
    "id": 5,
    "name": "Echo",
    "description": "Echo project focused on AI advancements.",
    "startDate": "2023-04-15T00:00:00Z",
    "endDate": "2023-11-30T00:00:00Z"
  },
  {
    "id": 6,
    "name": "Foxtrot",
    "description": "Exploring cutting-edge biotechnology.",
    "startDate": "2023-02-25T00:00:00Z",
    "endDate": "2023-08-25T00:00:00Z"
  },
  {
    "id": 7,
    "name": "Golf",
    "description": "Development of new golf equipment using AI.",
    "startDate": "2023-05-10T00:00:00Z",
    "endDate": "2023-12-10T00:00:00Z"
  },
  {
    "id": 8,
    "name": "Hotel",
    "description": "Hotel management system overhaul.",
    "startDate": "2023-03-01T00:00:00Z",
    "endDate": "2024-01-01T00:00:00Z"
  },
  {
    "id": 9,
    "name": "India",
    "description": "Telecommunication infrastructure upgrade.",
    "startDate": "2023-06-01T00:00:00Z",
    "endDate": "2023-12-01T00:00:00Z"
  },
  {
    "id": 10,
    "name": "Juliet",
    "description": "Initiative to enhance cyber-security measures.",
    "startDate": "2023-07-01T00:00:00Z",
    "endDate": "2024-02-01T00:00:00Z"
  }
];
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

    const { user, logOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
        toast("unable to log out");
      console.error("Error signing out: ", error);
    }
  };
  if (!user) return null;
    const currentUserDetails :UserType = user;

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  console.log("side bar " , user)

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            EDLIST
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
          <img
            src="https://pm-s3-images.s3.us-east-2.amazonaws.com/logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              EDROH TEAM
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

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
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
      <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUserDetails?.profileUrl ? (
                         <Image
                src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${currentUserDetails?.profileUrl}`}
                alt={currentUserDetails?.name || "User Profile Picture"}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
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