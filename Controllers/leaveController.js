
const db = require('../Models');

const LeaveController = {
    submitLeave: async (req, res) => {
        try {
            const { leaveType, startDate, purpose, duration } = req.body;
            const newLeave = await db.leaves.create({ leaveType, startDate, purpose, duration });
            res.status(201).json(newLeave);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getLeaveDetails: async (req, res) => {
        try {
            const leaveDetails = await db.leaves.findAll();
            res.status(200).json(leaveDetails);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = LeaveController;
