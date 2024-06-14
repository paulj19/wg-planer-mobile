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
  AssignedTo: number,
  Reminders: number,
  AssignmentDate: string,
}

export type Room = {
  Id: string,
  Number: string,
  Order: number,
  Resident: Resident | null,
}

export type Resident = {
  Id: string,
  Name: string,
  Available: boolean,
}

export type FeedItem = {
  Type: "NEW_RESIDENT" | "NEW_TASK",
  Name: string,
  Room?: string,
}

