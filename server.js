const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./Models');
const userRoutes = require('./Routes/userRoutes');
const leaveRoutes = require('./Routes/leaveRoutes');
const leaveTypesRoutes = require('./Routes/leaveTypesRoutes');
const profileRoutes = require('./Routes/profileRoutes');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));

app.use('/api/users', userRoutes);
app.use('/api/leaverequest', leaveRoutes);
app.use('/api/leavetypes', leaveTypesRoutes);
app.use('/api/profile', profileRoutes);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
