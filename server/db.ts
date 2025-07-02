
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  instructor: string;
  schedule: string;
}

export class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private courses: Map<string, Course> = new Map();
  private nextUserId = 1;
  private nextCourseId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Add sample users
    this.createUser({
      email: 'student@excellence.edu',
      password: 'password123',
      name: 'Excellence Student'
    });

    this.createUser({
      email: 'admin@excellence.edu',
      password: 'admin123',
      name: 'Excellence Admin'
    });

    // Add sample courses
    this.createCourse({
      name: 'Advanced Programming',
      code: 'CS301',
      credits: 3,
      instructor: 'Dr. Smith',
      schedule: 'MWF 10:00-11:00'
    });

    this.createCourse({
      name: 'Data Structures',
      code: 'CS302',
      credits: 4,
      instructor: 'Prof. Johnson',
      schedule: 'TTh 2:00-3:30'
    });
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      id: this.nextUserId.toString(),
      ...userData,
      createdAt: new Date()
    };
    
    this.users.set(user.id, user);
    this.nextUserId++;
    
    return user;
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  authenticateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    
    if (user && user.password === password) {
      return user;
    }
    
    return null;
  }

  createCourse(courseData: Omit<Course, 'id'>): Course {
    const course: Course = {
      id: this.nextCourseId.toString(),
      ...courseData
    };
    
    this.courses.set(course.id, course);
    this.nextCourseId++;
    
    return course;
  }

  getAllCourses(): Course[] {
    return Array.from(this.courses.values());
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

// Export singleton instance
export const database = new InMemoryDatabase();
