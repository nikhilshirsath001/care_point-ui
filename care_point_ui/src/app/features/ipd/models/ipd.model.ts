interface Patient {
  patientId: number;
  patientNo: string;
  patientName: string;
  age: number;
  gender: string;
  mobile: string;
  abhaId?: string;
}

interface Doctor {
  staffId: number;
  name: string;
  specialization?: string;
}

interface Ward {
  wardId: number;
  wardName: string;
}

interface Room {
  roomId: number;
  roomName: string;
  wardId: number;
}

interface Bed {
  bedId: number;
  bedNumber: string;
  roomId: number;
  status: string;
}
