const db = require('../Models');

const LeaveTypesController = {
    submitLeaveTypes: async (req, res) => {
        try {
            const { leave_type_name, leave_description } = req.body;
            const newLeaveType = await db.leavetypes.create({ leave_type_name, leave_description });
            return res.status(201).json(newLeaveType);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getLeaveTypesDetails: async (req, res) => {
        try {
            const leaveTypeDetails = await db.leavetypes.findAll();
            return res.status(200).json(leaveTypeDetails);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = LeaveTypesController;
