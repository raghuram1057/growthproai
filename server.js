import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Sample data and functions
const sampleHeadlines = [
  "Why {name} is {location}'s Best Kept Secret in 2025",
  "Top 5 Reasons {name} Dominates the {location} Market",
  "How {name} Became {location}'s Most Trusted Business",
  "{name}: The {location} Success Story Everyone's Talking About",
  "Discover Why {name} is {location}'s Rising Star",
  "The Ultimate Guide to {name} in {location}",
  "{name} Reviews: What {location} Customers Really Think",
  "From Startup to Success: {name}'s {location} Journey",
  "Why {name} is Revolutionizing Business in {location}",
  "{name}: Your Go-To Destination in {location}",
  "Breaking: {name} Sets New Standards in {location}",
  "The {name} Advantage: Leading {location} Innovation"
];

const generateBusinessData = (name, location) => {
  // Generate consistent but varied data based on business name
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const locationHash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate rating between 3.5 and 4.9
  const rating = Math.round((3.5 + (nameHash % 140) / 100) * 10) / 10;
  
  // Generate reviews between 50 and 500
  const reviews = 50 + ((nameHash + locationHash) % 450);
  
  // Generate headline
  const headlineIndex = (nameHash + locationHash) % sampleHeadlines.length;
  const headline = sampleHeadlines[headlineIndex]
    .replace(/{name}/g, name)
    .replace(/{location}/g, location);
  
  return { rating, reviews, headline };
};

const generateRandomHeadline = (name, location) => {
  const randomIndex = Math.floor(Math.random() * sampleHeadlines.length);
  return sampleHeadlines[randomIndex]
    .replace(/{name}/g, name)
    .replace(/{location}/g, location);
};

// API Routes
app.post('/api/business-data', (req, res) => {
  try {
    const { name, location } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ 
        error: 'Business name and location are required' 
      });
    }
    
    // Simulate API delay
    setTimeout(() => {
      const data = generateBusinessData(name, location);
      res.json(data);
    }, 1000);
    
  } catch (error) {
    console.error('Error generating business data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/regenerate-headline', (req, res) => {
  try {
    const { name, location } = req.query;
    
    if (!name || !location) {
      return res.status(400).json({ 
        error: 'Business name and location are required' 
      });
    }
    
    // Simulate API delay
    setTimeout(() => {
      const headline = generateRandomHeadline(name, location);
      res.json({ headline });
    }, 800);
    
  } catch (error) {
    console.error('Error generating headline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- POST /api/business-data`);
  console.log(`- GET /api/regenerate-headline`);
  console.log(`- GET /api/health`);
});