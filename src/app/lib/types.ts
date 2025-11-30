export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'employee' | 'admin';
  status: 'active' | 'blocked';
  avatar: string;
  createdAt: Date;
};

export type AttendanceSheet = {
  id: string;
  title: string;
  type: 'student' | 'employee';
  view: 'daily' | 'weekly' | 'monthly';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  memberIds: string[];
};

export type AttendanceRecord = {
  id: string;
  sheetId: string;
  userId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'leave';
  notes?: string;
};
