# Digital Express Exchange

A modern e-commerce website for technology products with an admin panel for managing inventory, powered by Neon PostgreSQL.

## Features

- **Responsive Design**: Modern, mobile-friendly interface
- **Product Categories**: Phones, Laptops, and PCs
- **Admin Panel**: Add, view, and delete products
- **Image Upload**: Support for product images
- **Search Functionality**: Search products by name or description
- **Dynamic Content**: Products are loaded from the Neon PostgreSQL database
- **Real Database**: ACID compliant PostgreSQL with automatic backups
- **Cool Visual Effects**: Clip-path designs and hover animations
- **Interactive Hover**: Full product details on hover with smooth transitions

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: Neon PostgreSQL (serverless)
- **File Upload**: Multer
- **Database Driver**: pg (node-postgres)

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Neon PostgreSQL account (free tier available)

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - The project is already configured with a Neon PostgreSQL database
   - Database connection is stored in `config.js`
   - Tables are automatically created on first run

4. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the website**
   - Main website: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Database Schema

### Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

### Admin Panel

1. Navigate to http://localhost:3000/admin
2. Fill out the product form:
   - **Product Name**: Name of the product
   - **Category**: Select from Phones, Laptops, or PC
   - **Price**: Product price in XAF (Central African CFA franc)
   - **Image**: Upload a product image (optional)
   - **Description**: Product description
3. Click "Add Product" to save
4. View all products in the "Current Products" section
5. Delete products using the "Delete" button

### Website Navigation

- **Home**: Landing page with company information
- **Phones**: Browse and search phone products
- **Laptops**: Browse and search laptop products
- **PC**: Browse and search PC products
- **About Us**: Company information

### Product Management

- Products are automatically categorized and displayed on their respective pages
- Search functionality works across all product pages
- Product images are stored in the `uploads/` directory
- Product data is stored in Neon PostgreSQL database

### Visual Features

- **Clip-path Designs**: Unique geometric shapes for product cards
- **Hover Effects**: Smooth transitions and animations
- **Category-specific Colors**: Different color schemes for each category
- **Interactive Elements**: Hover overlays show full product details
- **Modern UI**: Clean, professional design with smooth animations

## File Structure

```
Digital Express Exchange/
├── server.js              # Express server
├── database.js            # Database operations
├── config.js              # Configuration (database connection)
├── package.json           # Node.js dependencies
├── uploads/               # Product images (auto-generated)
├── admin.html             # Admin panel
├── index.html             # Homepage
├── phones.html            # Phones category page
├── laptops.html           # Laptops category page
├── pc.html               # PC category page
├── about.html            # About page
├── styles.css            # Main stylesheet
└── README.md             # This file
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:category` - Get products by category
- `POST /api/products` - Add new product
- `DELETE /api/products/:id` - Delete product
- `GET /api/status` - Get server and database status

## Visual Design Features

### Clip-path Effects
- **Product Cards**: Octagonal clip-path with smooth transitions
- **Images**: Geometric shapes that transform on hover
- **Buttons**: Hexagonal designs with hover animations
- **Search Elements**: Angled input fields with focus effects

### Hover Interactions
- **Product Details**: Full overlay with product information
- **Image Transformations**: Clip-path changes from geometric to rectangular
- **Card Elevation**: Cards lift and show enhanced shadows
- **Color-coded Categories**: Each category has unique color schemes

### Category Color Schemes
- **Phones**: Blue gradient (#007bff to #00d4ff)
- **Laptops**: Green gradient (#28a745 to #20c997)
- **PCs**: Red-Orange gradient (#dc3545 to #fd7e14)

## Database Benefits

### Neon PostgreSQL Advantages
- **Serverless**: No server management required
- **Automatic Scaling**: Handles traffic spikes automatically
- **Backups**: Automatic daily backups
- **Branching**: Create database branches for development
- **Performance**: Optimized for web applications
- **Security**: SSL encryption and connection pooling

### Data Integrity
- **ACID Compliance**: Transactions ensure data consistency
- **Constraints**: Database-level validation
- **Indexing**: Fast queries with proper indexing
- **Relationships**: Support for complex data relationships

## Security Notes

⚠️ **Important**: This is a demo project without authentication. In a production environment, you should:

- Implement user authentication for the admin panel
- Add input validation and sanitization
- Use environment variables for database credentials
- Implement rate limiting
- Add HTTPS
- Validate file uploads more strictly
- Use connection pooling for better performance

## Customization

### Adding New Categories

1. Update the category dropdown in `admin.html`
2. Create a new HTML page for the category
3. Update the navigation menu in all HTML files
4. Add category-specific color schemes
5. The API will automatically handle the new category

### Database Modifications

To modify the database schema:
1. Update the `initializeDatabase()` function in `database.js`
2. Restart the server to apply changes
3. Existing data will be preserved

### Styling

- Modify `styles.css` to change the appearance
- The design uses CSS Grid and Flexbox for responsive layouts
- Color scheme and fonts can be easily customized
- Clip-path values can be adjusted for different geometric shapes

## Troubleshooting

### Common Issues

1. **Database connection error**: Check the connection string in `config.js`
2. **Port already in use**: Change the port in `config.js`
3. **Images not loading**: Check that the `uploads/` directory exists
4. **Products not saving**: Check database connection and permissions

### Error Messages

- "Database connection error": Verify Neon connection string
- "Error loading products": Check if the server is running
- "Failed to add product": Check form validation and database connection
- "Only image files are allowed": Ensure uploaded files are images

## Performance

### Database Optimization
- Connection pooling for efficient database connections
- Prepared statements to prevent SQL injection
- Proper indexing on frequently queried columns
- Efficient queries with proper WHERE clauses

### File Handling
- Image files are stored locally for fast access
- Automatic cleanup of orphaned image files
- File size and type validation

### Visual Performance
- CSS transitions for smooth animations
- Optimized clip-path calculations
- Efficient hover state management
- Responsive design for all screen sizes

## License

This project is for educational purposes. Feel free to modify and use as needed.

## Support

For issues or questions, please check the troubleshooting section above or review the code comments for additional guidance. 