const db = require("../Models");
const LeaveRequestController = require('./leaveRequestController'); 

const approvalHistoryController = {
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