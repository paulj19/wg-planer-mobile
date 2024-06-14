import { FloorItem} from "../../types/types";

const floorStub: FloorItem = {
      Id: "66603e2a00afb9bb44b3cadb",
      FloorName: "Awesome floor",
      Tasks: [
        { Id: "0", Name: "Küche reinigen", AssignedTo: 1, Reminders: 1, AssignmentDate: "2024-06-13T14:48:00.000Z"},
        { Id: "1", Name: "Glastonne wegmachen", AssignedTo: 1, Reminders: 1, AssignmentDate: "2024-05-16T14:48:00.000Z"},
        { Id: "2", Name: "Schwarz sack", AssignedTo: 1, Reminders: 0, AssignmentDate: "2024-06-10T14:48:00.000Z"},
        { Id: "3", Name: "Mülltonne wegbringen", AssignedTo: 1, Reminders: 2, AssignmentDate: "2024-06-13T14:48:00.000Z"},
        { Id: "4", Name: "Gelbersack wegbringen", AssignedTo: 1, Reminders: 3, AssignmentDate: "2024-06-19:48:00.000Z"},
        { Id: "5", Name: "Ofen Reinigen", AssignedTo: 1, Reminders: 4, AssignmentDate: "2024-06-20T14:48:00.000Z"},
      ],
      Rooms: [
        { Id: "0", Number: "301", Order: 1, Resident: { Id: "1", Name: "Max Musterman", Available: true } },
        { Id: "1", Number: "302", Order: 2, Resident: { Id: "2", Name: "Leona Musterman", Available: true}},
        { Id: "2", Number: "303", Order: 3, Resident: { Id: "3", Name: "Evelyn Weber", Available: false}},
        { Id: "3", Number: "304", Order: 4, Resident: { Id: "4", Name: "Nodir Shirinov", Available: true}},
        { Id: "4", Number: "305", Order: 5, Resident: { Id: "5", Name: "Benjamin Renert", Available: false}},
        { Id: "5", Number: "306", Order: 6, Resident: { Id: "6", Name: "Abdul Majeed Nethyahu", Available: true}},
        { Id: "6", Number: "307", Order: 7, Resident: null},
      ],
      Feed: [
        {
          Type: "NEW_RESIDENT",
          Name: "John Doe",
          Room: "307"
        },
        {
          Type: "NEW_TASK",
          Name: "Mikrowelle reinigen",
        },
      ]
    }

export default floorStub;
