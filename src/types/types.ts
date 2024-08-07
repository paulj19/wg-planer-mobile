import { number } from "yup";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
};

export type FloorItem = {
  Id: string;
  FloorName: string;
  Tasks: Task[];
  Rooms: Room[];
  Votings: Voting[];
};

export type Task = {
  Id: string;
  Name: string;
  AssignedTo: number | null;
  Reminders: number;
  AssignmentDate: string;
};

export type Room = {
  Id: number;
  Number: string;
  Order: number;
  Resident: Resident | null;
};

export type Resident = {
  Id: string;
  Name: string;
  Available: boolean;
  ExpoPushToken: string;
};

export type Voting = {
  Id: number;
  Type: string;
  Data: string;
  Accepts: number;
  Rejects: number;
  LaunchDate: string;
  VotingWindow: string;
  CreatedBy: string;
};

export type NotificationType =
  | "NEW_RESIDENT"
  | "NEW_TASK"
  | "TASK_DONE"
  | "TASK_ASSIGN";

export type NotificationData = {
  FloorId: string;
  Type: NotificationType;
  Task: Task | undefined;
};
