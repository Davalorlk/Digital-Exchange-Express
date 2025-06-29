const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const config = require('./config');
const db = require('./database');

const app = express();
const PORT = config.port;

// Middleware
const corsOptions = {
    origin: 'https://digital-exchange-express.vercel.app',
    credentials: true // if you use cookies/auth, otherwise can be omitted
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Initialize database on startup
async function startServer() {
    try {
        console.log('🚀 Starting Digital Express Exchange server...');
        
        // Try to initialize database
        const dbConnected = await db.initializeDatabase();
        
        if (dbConnected) {
            console.log('✅ Database connected successfully');
        } else {
            console.log('⚠️  Database connection failed - running in offline mode');
            console.log('💡 The website will work, but products cannot be saved to database');
            console.log('💡 Please check your Neon database connection and restart the server');
        }
        
        // Start server regardless of database status
        const server = app.listen(PORT, () => {
            console.log(`🌐 Server is running on http://localhost:${PORT}`);
            console.log(`🔧 Admin page: http://localhost:${PORT}/admin`);
            console.log(`📊 Database status: ${dbConnected ? 'Connected' : 'Disconnected'}`);
        });

        // Handle server errors gracefully
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use. Please try a different port or stop the existing process.`);
                console.error('💡 You can change the port in config.js or kill the process using:');
                console.error(`   netstat -ano | findstr :${PORT}`);
                console.error('   taskkill /PID <PID> /F');
            } else {
                console.error('❌ Server error:', error);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Routes

// Admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Failed to get products' });
    }
});

// Get products by category
app.get('/api/products/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const products = await db.getProductsByCategory(category);
        res.json(products);
    } catch (error) {
        console.error('Error getting products by category:', error);
        res.status(500).json({ error: 'Failed to get products' });
    }
});

// Add new product
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        // Check if database is connected
        if (!db.isConnected()) {
            return res.status(503).json({ 
                error: 'Database is not connected. Please check your Neon database connection and restart the server.' 
            });
        }

        const { name, category, description, price } = req.body;
        
        if (!name || !category || !description || !price) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, category, description, price' 
            });
        }

        const productData = {
            name: name,
            category: category,
            description: description,
            price: parseFloat(price),
            image: req.file ? `/uploads/${req.file.filename}` : null
        };

        const newProduct = await db.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        // Check if database is connected
        if (!db.isConnected()) {
            return res.status(503).json({ 
                error: 'Database is not connected. Please check your Neon database connection and restart the server.' 
            });
        }

        const productId = req.params.id;
        const deletedProduct = await db.deleteProduct(productId);
        
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Remove image file if it exists
        if (deletedProduct.image) {
            const imagePath = path.join(__dirname, deletedProduct.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Database status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        database: db.isConnected() ? 'connected' : 'disconnected',
        server: 'running',
        timestamp: new Date().toISOString()
    });
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
startServer(); 