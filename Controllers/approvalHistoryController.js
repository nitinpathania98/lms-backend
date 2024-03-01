const db = require("../Models");
const LeaveRequestController = require('./leaveRequestController');
let io; // Declare io variable at the top

// Function to set io
const setIo = (socketIo) => {
    io = socketIo;
};
const approvalHistoryController = {
    setIo: setIo,

    // createApprovalHistory: async (req, res) => {
    //     try {
    //         const { leave_request_id, approver_id, response, comments } = req.body;
    //         const approvalHistory = await db.approvalHistory.create({
    //             leave_request_id,
    //             approver_id,
    //             response,
    //             comments
    //         });

    //         // Update the status of the leave request to "approved"
    //         await LeaveRequestController.updateLeaveRequestStatus(approvalHistory.id);

    //         if (io) {
    //             // Emit 'approvalUpdate' event to notify clients
    //             io.emit('approvalUpdate', {
    //                 leave_request_id,
    //                 response,
    //             });
    //         }

    //         return res.status(201).json(approvalHistory);
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ error: "Internal Server Error" });
    //     }
    // },
    createApprovalHistory: async (req, res) => {
        try {
            const { leave_request_id, approver_id, response, comments } = req.body;
            const approvalHistory = await db.approvalHistory.create({
                leave_request_id,
                approver_id,
                response,
                comments
            });

            // Update the status of the leave request to "approved"
            await LeaveRequestController.updateLeaveRequestStatus(approvalHistory.id);

            // Get the user who requested leave
            const leaveRequest = await db.leaveRequest.findByPk(leave_request_id, { include: [db.User] });
            if (!leaveRequest || !leaveRequest.User) {
                console.error('Leave request or user not found');
                return res.status(500).json({ error: "Internal Server Error" });
            }

            // Send a notification to the user
            const notificationLog = await db.notificationLog.create({
                recipient_UserId: leaveRequest.UserId, /// Assuming UserId corresponds to the email of the user
                notification_type: 'status_update',
                message_content: `Your leave request has been ${response}.`,
            });

            // Emit a notification event for real-time communication
            if (io) {
                io.emit('notification', { userId: leaveRequest.UserId, message: 'Leave request status updated' });
            }

            return res.status(201).json(approvalHistory);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },



    getAllApprovalHistory: async (req, res) => {
        try {
            const approvalHistory = await db.approvalHistory.findAll();
            return res.status(200).json(approvalHistory);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getApprovalHistoryById: async (req, res) => {
        try {
            const approvalHistoryId = req.params.id;
            const approvalHistory = await db.approvalHistory.findByPk(approvalHistoryId);
            if (!approvalHistory) {
                return res.status(404).json({ error: "Approval history entry not found" });
            }
            return res.status(200).json(approvalHistory);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    updateApprovalHistory: async (req, res) => {
        try {
            const approvalHistoryId = req.params.id;
            const { leave_request_id, approver_id, response, comments } = req.body;
            const approvalHistory = await db.approvalHistory.findByPk(approvalHistoryId);
            if (!approvalHistory) {
                return res.status(404).json({ error: 'Approval history not found' });
            }
            await approvalHistory.update({
                leave_request_id,
                approver_id,
                response,
                comments
            });
            return res.status(200).json(approvalHistory);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteApprovalHistory: async (req, res) => {
        try {
            const approvalHistoryId = req.params.id;
            const approvalHistory = await db.approvalHistory.findByPk(approvalHistoryId);
            if (!approvalHistory) {
                return res.status(404).json({ error: 'Approval history not found' });
            }
            await approvalHistory.destroy();
            return res.status(200).json({ message: 'Approval history deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = approvalHistoryController;