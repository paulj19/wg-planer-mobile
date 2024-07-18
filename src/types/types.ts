export type UserProfile = {
  id: number,
  username: string,
  email: string,
}

export type FloorItem = {
  Id: string,
  FloorName: string,
  Tasks: Task[],
  Rooms: Room[],
  Feed: FeedItem[],
}

export type Task = {
  Id: string,
  Name: string,
  AssignedTo: number | null,
  Reminders: number,
  AssignmentDate: string,
}

export type Room = {
  Id: number,
  Number: string,
  Order: number,
  Resident: Resident | null,
}

export type Resident = {
  Id: string,
  Name: string,
  Available: boolean,
}

export type FeedItem = NewResidentFeedItem | NewTaskFeedItem

export type NewResidentFeedItem = {
  Type: "NEW_RESIDENT",
  NewResident: string,
  Room: string,
}

export type NewTaskFeedItem = {
  Type: "NEW_TASK",
  Creator: string,
  TaskName: string,
}

export type NotificationType = "NEW_RESIDENT" | "NEW_TASK" | "TASK_DONE" | "TASK_ASSIGNED"

export type NotificationData = {
  FloorId: string,
  Type: NotificationType,
  Task: Task | undefined,
}
