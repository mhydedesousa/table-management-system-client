export interface RegisterUserDTO {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  token?: string;
}
