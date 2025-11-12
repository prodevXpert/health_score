// User Type Definitions

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  INSURER = 'insurer',
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  age: number;
  gender: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileDto {
  fullName?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

