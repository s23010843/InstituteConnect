import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { storage } from "./storage";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Basic middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/pages", async (req, res) => {
  try {
    const pages = await storage.getPages();
    res.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: "Failed to fetch pages" });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const news = await storage.getNews();
    res.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await storage.getCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

app.get("/api/faculty", async (req, res) => {
  try {
    const faculty = await storage.getFaculty();
    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
});

// Serve static files from client/dist in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  // Handle client-side routing - serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    } else {
      res.status(404).json({ message: 'API endpoint not found' });
    }
  });
} else {
  // In development, redirect root to frontend dev server
  app.get('/', (req, res) => {
    res.redirect('http://localhost:5173');
  });
}

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

export default app;