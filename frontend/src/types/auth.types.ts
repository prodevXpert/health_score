// Authentication Type Definitions
// Matches backend DTOs exactly

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  INSURER = 'insurer',
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
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

export interface UpdateUserDto {
  fullName?: string;
  age?: number;
  gender?: 'M' | 'F' | 'O';
}

