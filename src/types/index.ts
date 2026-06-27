export type UserRole = 'student' | 'election_officer' | 'auditor' | 'admin';
export type UserScope = 'university' | 'faculty' | 'department';
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  faculty_id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentRecord {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  faculty_id?: string;
  department_id?: string;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  username?: string;
  student_record_id?: string;
  faculty_id?: string;
  department_id?: string;
  scope?: UserScope;
  is_email_verified: boolean;
  is_face_enrolled: boolean;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  studentId: string;
  facultyId: string;
  departmentId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
