const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./Models');
const userRoutes = require('./Routes/userRoutes');
const leaveTypesRoutes = require('./Routes/leaveTypesRoutes');
const leaveRoutes = require('./Routes/leaveRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const leaveRequestRoutes = require('./Routes/leaveRequestRoutes');
const approvalTableRoutes = require('./Routes/approvalTableRoutes');
const notificationLogRoutes = require('./Routes/notificationLogRoutes');
const createUserRoutes = require('./Routes/createUserRoutes');
const attendanceRoutes = require('./Routes/attendanceRoutes');

const PORT = process.env.PORT || 8080;
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const approvalHistoryController = require('./Controllers/approvalHistoryController');
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const connectedUsers = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Store user ID and socket ID upon connection
    connectedUsers[socket.userId] = socket.id;

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Remove user ID and socket ID upon disconnection
        delete connectedUsers[socket.userId];
    });
});


function getRecipientSocketId(userId) {
    return connectedUsers[userId];
}
const SocketId = getRecipientSocketId()

approvalHistoryController.setIo(io);

app.get('/send-message', (req, res) => {
    io.emit('message', req.query.message);
    res.send('Message sent');
    console.log('Receive message', req.query.message);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));

app.use('/api/users', userRoutes);
app.use('/api', leaveRoutes);
app.use('/api', leaveTypesRoutes);
app.use('/api/leavetypes', leaveTypesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', leaveRequestRoutes);
app.use('/api', approvalTableRoutes);
app.use('/api', notificationLogRoutes);
app.use('/api/employee', createUserRoutes);
app.use('/api/employee', attendanceRoutes);

db.sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
