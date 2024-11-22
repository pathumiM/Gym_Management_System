import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';  // Added CORS

//Inventory - Deshitha
import itemsRouter from './routes/items.route.js';

//Schedule - Nethula
import Schedule from './routes/schedule.route.js';

//Progress - Kalish
import Progress from './routes/order.route.js';

//Promo Package - Dhanga
import PromoPackage from './routes/Promo.route.js';
import packageRoutes from './routes/packageRoutes.js';


//Feedback - Okitha
import instructFeedbacksRouter from './routes/Feedback/instructFeedbackRouter.js';
import packageFeedbackRouter from './routes/Feedback/packageFeedbackRouter.js';


//Employee - Pathumi
import salaryRoute from './routes/Employee/salaryRoutes.js';
import infoRoute from './routes/Employee/employeeInfoRoutes.js';
import otRoute from './routes/Employee/overtimeRoutes.js';
import leaveRoute from './routes/Employee/leaveRoutes.js';

//Supplier - Sajana
import Supplier from './routes/order.route.js';



const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

const app = express();

// Set up CORS
app.use(cors());

// Set the view engine to EJS
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'ejs');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// User routes
app.use('/api/users', userRoutes);

//Inventory - Deshitha
app.use('/api/items', itemsRouter);

//Schedule - Nethula
app.use('/api/schedule', Schedule);

//Progress - Kalish
app.use('/api/progress', Progress);

//Promo Package - Dhanga
app.use('/api/reco', PromoPackage);
app.use('/api/packages', packageRoutes);

//Feedback - Okitha
app.use('/api', instructFeedbacksRouter,packageFeedbackRouter);

//Employee - Pathumi
app.use('/salarys', salaryRoute);
app.use('/informations',infoRoute);
app.use('/ot', otRoute);
app.use('/leave', leaveRoute)

//Supplier - Sajana
app.use('/api/sup', Supplier);

// Serve static files and handle routing for production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  // For development, render EJS on the root route
  app.get('/', (req, res) => {
    res.render('index');  // Render `index.ejs` file from the `views` directory
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));





