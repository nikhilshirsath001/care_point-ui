export interface UserModel {
  userId: number;
  staffId: number;
  employeeNo: string;

  firstName: string;
  lastName: string;

  username: string;

  active: boolean;
}

export interface UserRequest {
  username: string;

  email: string;

  role: string;

  active: boolean;
}
