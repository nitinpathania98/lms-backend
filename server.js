//importing modules
const express = require('express')
const cors = require('cors');

const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const db = require('./Models')
const userRoutes = require('./Routes/userRoutes')
const leaveRoutes = require('./Routes/leaveRoutes');
const leaveTypesRoutes = require('./Routes/leaveTypesRoutes');
const profileRoutes = require('./Routes/profileRoutes');

//setting up your port
const PORT = process.env.PORT || 8080

//assigning the variable app to express
const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: '*',
    credentials: true,
}));



//routes for the user API
app.use('/api/users', userRoutes)
app.use('/api/leave', leaveRoutes);
app.use('/api', leaveTypesRoutes);
app.use('/api/profile', profileRoutes);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});