const db = require("../Models");
const LeaveSubmit = db.leaveSubmit;

const submitLeave = async (req, res) => {
    try {
        const { leaveType, purpose, duration } = req.body;
        const data = {
            leaveType,
            purpose,
            duration
        };
        const result = await LeaveSubmit.create(data);
        if (!leaveType || !purpose || !duration) {
            return res.status(400).json({ message: 'Incomplete leave details' });
        } else {
            return res.status(201).send(result);
        }
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    submitLeave
};