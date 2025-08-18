

// Request
export interface CreateMeetingDTO {
  name: string;
  orgId: string;
  subject: string;
  startTime: Date;
  endTime: Date;
}

export interface UpdateMeetingDTO {
  name?: string;
  subject?: string;
  startTime?: Date;
  endTime?: Date;
}

// Response
export interface MeetingDTO {
  id: string;
  name: string;
  roomId: string;
  orgId: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
