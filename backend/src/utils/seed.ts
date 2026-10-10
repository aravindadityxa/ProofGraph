import mongoose from 'mongoose';
import { User, UserRole, UserStatus } from '../models/User';
import { Record, RecordCategory, RecordStatus } from '../models/Record';
import { config } from '../config/environment';

const users = [
  {
    name: 'Administrator',
    userId: 'admin',
    email: 'admin@proofgraph.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    department: 'IT Administration',
    organization: 'ProofGraph Inc.',
  },
  {
    name: 'Sarah Mitchell',
    userId: 'sarah.mitchell',
    email: 'sarah.mitchell@proofgraph.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    department: 'Operations',
    organization: 'ProofGraph Inc.',
  },
  {
    name: 'John Doe',
    userId: 'john.doe',
    email: 'john.doe@email.com',
    password: 'password123',
    role: UserRole.GENERAL_USER,
    status: UserStatus.ACTIVE,
    department: 'Engineering',
    organization: 'TechCorp Solutions',
  },
  {
    name: 'Emily Chen',
    userId: 'emily.chen',
    email: 'emily.chen@email.com',
    password: 'password123',
    role: UserRole.GENERAL_USER,
    status: UserStatus.ACTIVE,
    department: 'Product Design',
    organization: 'Design Labs',
  },
  {
    name: 'Michael Rodriguez',
    userId: 'michael.rodriguez',
    email: 'michael.r@email.com',
    password: 'password123',
    role: UserRole.GENERAL_USER,
    status: UserStatus.ACTIVE,
    department: 'Data Science',
    organization: 'Analytics Pro',
  },
  {
    name: 'Jessica Park',
    userId: 'jessica.park',
    email: 'jessica.park@email.com',
    password: 'password123',
    role: UserRole.GENERAL_USER,
    status: UserStatus.ACTIVE,
    department: 'Marketing',
    organization: 'Brand Studio',
  },
  {
    name: 'David Thompson',
    userId: 'david.thompson',
    email: 'david.t@email.com',
    password: 'password123',
    role: UserRole.GENERAL_USER,
    status: UserStatus.ACTIVE,
    department: 'Finance',
    organization: 'FinServe Group',
  },
];

const generateRecordId = (): string => {
  return `REC-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

const createRecords = (userId: mongoose.Types.ObjectId, userName: string) => {
  const baseRecords = [
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.IDENTITY,
      organization: 'National Identity Bureau',
      title: 'Government Issued ID',
      startDate: new Date('2020-01-15'),
      status: RecordStatus.VERIFIED,
      description: 'Official government identification verified',
      verifiedAt: new Date('2020-01-20'),
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.IDENTITY,
      organization: 'Address Verification Service',
      title: 'Proof of Residence',
      startDate: new Date('2022-03-10'),
      status: RecordStatus.VERIFIED,
      description: 'Current address verification',
      verifiedAt: new Date('2022-03-15'),
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.EDUCATION,
      organization: 'State University',
      title: 'Bachelor of Science in Computer Science',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2019-06-15'),
      status: RecordStatus.VERIFIED,
      description: 'Undergraduate degree in Computer Science',
      verifiedAt: new Date('2019-07-01'),
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.EDUCATION,
      organization: 'Tech Institute',
      title: 'Master of Science in Data Science',
      startDate: new Date('2019-09-01'),
      endDate: new Date('2021-05-30'),
      status: RecordStatus.VERIFIED,
      description: 'Graduate degree in Data Science',
      verifiedAt: new Date('2021-06-15'),
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.CERTIFICATION,
      organization: 'Cloud Certification Board',
      title: 'AWS Solutions Architect',
      startDate: new Date('2021-08-15'),
      status: RecordStatus.VERIFIED,
      description: 'Professional cloud architecture certification',
      verifiedAt: new Date('2021-08-20'),
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.EXPERIENCE,
      organization: 'Startup Innovations Inc.',
      title: 'Junior Software Developer',
      startDate: new Date('2019-07-01'),
      endDate: new Date('2020-12-31'),
      status: RecordStatus.VERIFIED,
      description: 'Entry-level development position',
      verifiedAt: new Date('2021-01-15'),
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.EXPERIENCE,
      organization: 'TechGrowth Solutions',
      title: 'Software Engineer',
      startDate: new Date('2021-01-15'),
      endDate: new Date('2022-06-30'),
      status: RecordStatus.VERIFIED,
      description: 'Full-stack development role',
      verifiedAt: new Date('2022-07-10'),
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.EMPLOYMENT,
      organization: 'Current Employer Corp.',
      title: 'Senior Software Engineer',
      startDate: new Date('2022-07-15'),
      status: RecordStatus.VERIFIED,
      description: 'Current employment position',
      verifiedAt: new Date('2022-07-20'),
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.CERTIFICATION,
      organization: 'Professional Development Academy',
      title: 'Leadership Training Certificate',
      startDate: new Date('2023-01-10'),
      status: RecordStatus.PENDING,
      description: 'Management and leadership skills training',
    },
    {
      recordId: generateRecordId(),
      user: userId,
      category: RecordCategory.CERTIFICATION,
      organization: 'Security Institute',
      title: 'Cybersecurity Fundamentals',
      startDate: new Date('2023-03-15'),
      status: RecordStatus.INCOMPLETE,
      description: 'Security certification in progress',
    },
  ];

  return baseRecords;
};

const seedDatabase = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✓ Connected to MongoDB');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log('✓ Existing data cleared');

    console.log('Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✓ Created ${createdUsers.length} users`);

    console.log('Creating records...');
    const allRecords = [];
    for (let i = 2; i < createdUsers.length; i++) {
      const userRecords = createRecords(createdUsers[i]._id, createdUsers[i].name);
      allRecords.push(...userRecords);
    }

    await Record.create(allRecords);
    console.log(`✓ Created ${allRecords.length} records`);

    console.log('\n✓ Database seeded successfully!\n');
    console.log('Test Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin User:');
    console.log('  User ID: admin');
    console.log('  Password: admin123');
    console.log('  Role: Admin\n');
    console.log('General User:');
    console.log('  User ID: john.doe');
    console.log('  Password: password123');
    console.log('  Role: General User\n');

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
