import { User } from "./user.types";

export enum Status {
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    UnderReview = "Under Review",
    Completed = "Completed",
}

export enum Priority{
    Urgent = "Urgent",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Backlog = "Backlog",
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
  assignee: User;
  comments?: Comment[];
  attachments?: Attachment[];
}


export interface UpdateTaskDTO {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  endDate?: string;
  points?: number;
  assignedUserId?: string;
}


interface Comment {

}

interface Attachment{
  fileName: string;
  fileURL: string;
}


// Request
export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  tags?: string;
  startDate: Date | string;
  endDate: Date | string;
  points?: number;
  projectId: string;
  assignedUserId: string;
  orgId: string;
}



// Response
export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  status?: string | null;
  priority?: string |null;
  tags?: string |null;
  startDate: Date | string;
  endDate: Date | string;
  points?: number |null;
  projectId: string;
  assignedUserId: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
}
