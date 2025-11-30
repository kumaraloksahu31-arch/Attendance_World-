import { faker } from '@faker-js/faker';
import type { User, AttendanceSheet, AttendanceRecord } from './types';

const createRandomUser = (role: 'student' | 'employee' | 'admin'): User => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role,
    status: faker.helpers.arrayElement(['active', 'blocked']),
    avatar: `https://avatar.vercel.sh/${faker.internet.userName()}.png`,
    createdAt: faker.date.past(),
  };
};

export const users: User[] = [
  ...Array.from({ length: 15 }, () => createRandomUser('student')),
  ...Array.from({ length: 10 }, () => createRandomUser('employee')),
  {
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '123-456-7890',
    role: 'admin',
    status: 'active',
    avatar: 'https://avatar.vercel.sh/admin-user.png',
    createdAt: new Date(),
  },
];

export const sheets: AttendanceSheet[] = [
  {
    id: 'sheet-1',
    title: 'Grade 10 - Mathematics',
    type: 'student',
    view: 'monthly',
    createdBy: 'admin-user-id',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-20'),
    memberIds: users.filter(u => u.role === 'student').slice(0, 5).map(u => u.id),
  },
  {
    id: 'sheet-2',
    title: 'Marketing Team - Q3 Sync',
    type: 'employee',
    view: 'weekly',
    createdBy: 'admin-user-id',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-07-18'),
    memberIds: users.filter(u => u.role === 'employee').slice(0, 4).map(u => u.id),
  },
  {
    id: 'sheet-3',
    title: 'Physics Class - Section B',
    type: 'student',
    view: 'monthly',
    createdBy: 'admin-user-id',
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-07-15'),
    memberIds: users.filter(u => u.role === 'student').slice(5, 10).map(u => u.id),
  },
];

const createAttendanceRecord = (sheet: AttendanceSheet, date: Date): AttendanceRecord[] => {
  return sheet.memberIds.map(userId => ({
    id: faker.string.uuid(),
    sheetId: sheet.id,
    userId,
    date,
    status: faker.helpers.arrayElement(['present', 'absent', 'late', 'leave']),
    notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
  }));
};

let records: AttendanceRecord[] = [];
sheets.forEach(sheet => {
  for (let i = 1; i <= 20; i++) {
    const date = new Date(2024, 6, i); // July 1 to 20
    records.push(...createAttendanceRecord(sheet, date));
  }
});

export const attendanceRecords: AttendanceRecord[] = records;
