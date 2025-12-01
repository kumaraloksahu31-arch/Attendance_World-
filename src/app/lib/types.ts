export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  avatar: string;
  createdAt: Date;
};
