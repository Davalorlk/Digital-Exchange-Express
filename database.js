const { Pool } = require('pg');
const config = require('./config');

// Create a connection pool with retry logic
let pool;

function createPool() {
    return new Pool({
        connectionString: config.database.connectionString,
        ssl: {
            rejectUnauthorized: false
        },
        // Add connection timeout and retry settings
        connectionTimeoutMillis: 10000, // 10 seconds
        idleTimeoutMillis: 30000, // 30 seconds
        max: 20, // Maximum number of clients in the pool
    });
}

// Initialize database tables
async function initializeDatabase() {
    try {
        console.log('Attempting to connect to Neon database...');
        
        // Test the connection first
        pool = createPool();
        
        // Test connection with timeout
        const client = await Promise.race([
            pool.connect(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Connection timeout')), 10000)
            )
        ]);
        
        // Create products table (with price field for XAF)
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                image VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('✅ Database connected and initialized successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        
        // Provide helpful error messages
        if (error.code === 'EAI_AGAIN') {
            console.error('💡 This appears to be a DNS resolution issue. Please check:');
            console.error('   1. Your internet connection');
            console.error('   2. The database connection string in config.js');
            console.error('   3. If the Neon database is active');
        } else if (error.message.includes('timeout')) {
            console.error('💡 Connection timed out. Please check:');
            console.error('   1. Your internet connection');
            console.error('   2. If the Neon database is accessible');
        }
        
        // Don't throw error, let the server start with fallback
        return false;
    }
}

// Get all products
async function getAllProducts() {
    try {
        if (!pool) {
            throw new Error('Database not connected');
        }
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        console.error('Error getting all products:', error);
        return []; // Return empty array as fallback
    }
}

// Get products by category
async function getProductsByCategory(category) {
    try {
        if (!pool) {
            throw new Error('Database not connected');
        }
        const result = await pool.query(
            'SELECT * FROM products WHERE LOWER(category) = LOWER($1) ORDER BY created_at DESC',
            [category]
        );
        return result.rows;
    } catch (error) {
        console.error('Error getting products by category:', error);
        return []; // Return empty array as fallback
    }
}

// Add new product (with price parameter for XAF)
async function addProduct(productData) {
    try {
        if (!pool) {
            throw new Error('Database not connected');
        }
        const { name, category, description, price, image } = productData;
        const result = await pool.query(
            'INSERT INTO products (name, category, description, price, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, category, description, price, image]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

// Delete product
async function deleteProduct(productId) {
    try {
        if (!pool) {
            throw new Error('Database not connected');
        }
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [productId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// Get product by ID
async function getProductById(productId) {
    try {
        if (!pool) {
            throw new Error('Database not connected');
        }
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [productId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error getting product by ID:', error);
        return null;
    }
}

// Check database connection status
function isConnected() {
    return pool !== undefined;
}

module.exports = {
    initializeDatabase,
    getAllProducts,
    getProductsByCategory,
    addProduct,
    deleteProduct,
    getProductById,
    isConnected,
    pool
}; 