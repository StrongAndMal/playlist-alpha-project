// Import user routes and register them
import userRoutes from './routes/userRoutes';
app.use('/api/users', userRoutes);

// Setup static file serving for uploaded images
app.use('/uploads', express.static('uploads')); 