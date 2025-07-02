
import { Router } from 'express';
import { InMemoryDatabase } from './db';

const router = Router();
const database = new InMemoryDatabase();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication endpoints
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Mock authentication logic
    const user = database.authenticateUser(email, password);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    res.json({ 
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error during login' 
    });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Name, email and password are required' 
      });
    }

    const existingUser = database.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User already exists with this email' 
      });
    }

    const newUser = database.createUser({ email, password, name });
    
    res.status(201).json({ 
      message: 'Registration successful',
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Internal server error during registration' 
    });
  }
});

router.post('/auth/logout', (req, res) => {
  try {
    // In a real app, you'd clear the session/token here
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Internal server error during logout' 
    });
  }
});

// User endpoints
router.get('/users/profile', (req, res) => {
  try {
    // Mock authentication check - in real app, verify token/session
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Mock user profile data
    res.json({
      id: '1',
      name: 'Excellence Student',
      email: 'student@excellence.edu',
      enrollmentDate: '2024-01-15',
      program: 'Computer Science',
      year: 2,
      gpa: 3.8
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Internal server error fetching profile' 
    });
  }
});

// Academic endpoints
router.get('/academic/courses', (req, res) => {
  try {
    res.json([
      {
        id: '1',
        name: 'Advanced Programming',
        code: 'CS301',
        credits: 3,
        instructor: 'Dr. Smith',
        schedule: 'MWF 10:00-11:00'
      },
      {
        id: '2',
        name: 'Data Structures',
        code: 'CS302',
        credits: 4,
        instructor: 'Prof. Johnson',
        schedule: 'TTh 2:00-3:30'
      }
    ]);
  } catch (error) {
    console.error('Courses fetch error:', error);
    res.status(500).json({ 
      message: 'Internal server error fetching courses' 
    });
  }
});

router.get('/academic/grades', (req, res) => {
  try {
    res.json([
      {
        courseId: '1',
        courseName: 'Advanced Programming',
        grade: 'A',
        credits: 3,
        semester: 'Fall 2024'
      },
      {
        courseId: '2',
        courseName: 'Data Structures',
        grade: 'B+',
        credits: 4,
        semester: 'Fall 2024'
      }
    ]);
  } catch (error) {
    console.error('Grades fetch error:', error);
    res.status(500).json({ 
      message: 'Internal server error fetching grades' 
    });
  }
});

// Error handling middleware
router.use((error: Error, req: any, res: any, next: any) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

export default router;
