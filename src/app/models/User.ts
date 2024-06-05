export interface User {
  id: string;
  fullName: string;
  dateOfBirth: string; 
  username: string; 
  email: string; 
  gender: string; 
  phoneNumber: string; 
  address: string; 
  avatar: string; 
  isLocked: boolean; 
  role: string; 
  token?: string;
}

export interface Image {
  imageUrl: string;
  publicId: string;
}

export interface UserParams {
  pageNumber: number;
  pageSize: number;
  // Query: string | null;
  // Roles?: string[];
}