

import { User } from "../../../../../libs/shared/types/src";

export interface Invitation {
  orgId: string;
  token: string;

}

//redux initial states
export interface AuthState {
  user: User | Organization |null ;
  isLoading: boolean;
  error: string | null;
  invitation: Invitation | null;
}

export interface ProjectState {
  projects: Project[] | null;
  isLoading: boolean;
  fetchError: string | null,
  createError: string | null,
  updateError: string | null,
  updateLoading: boolean,
  deleteError: string | null,
  deleteLoading: boolean,
}
export interface TaskState {
  tasks: Task[] | null;
  fetchError: string | null,
  createError: string | null,
  updateError: string | null,
  deleteError: string | null,
  fetchLoading: boolean,
  createLoading: boolean,
  updateLoading: boolean,
  deleteLoading: boolean,
}


export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}
export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  endDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: Organization;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}
export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}


export interface Organization {
  id: string;
  name: string;
  email: string;
  password: string;
  description?: string | null;
  profileUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  location?: string | null;
  phoneNumber?: string | null;
  inviteCode?: string | null;
  role: "organization";
  plan: string;
  subscriptionId?: string | null;
  settings?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;

  members?: User[];     // You need to define the User interface separately
  tasks?: Task[];       // Define Task interface if used
  projects?: Project[]; // Define Project interface if used
}