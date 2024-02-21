const db = require("../Models");

const LeaveRequestController = {
  createLeaveRequest: async (req, res) => {
    try {
      const { employee_id, leave_type, start_date, end_date, reason } = req.body;
      const leaveRequest = await db.leaveRequest.create({
        employee_id,
        leave_type,
        start_date,
        end_date,
        reason
      });
      return res.status(201).json(leaveRequest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },


  getAllLeaveRequests: async (req, res) => {
    try {
      const leaveRequests = await db.leaveRequest.findAll();
      return res.status(200).json(leaveRequests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getLeaveRequestById: async (req, res) => {
    try {
      const leaveRequestId = req.params.id;
      const leaveRequest = await db.leaveRequest.findByPk(leaveRequestId);
      if (!leaveRequest) {
        return res.status(404).json({ error: "Leave request not found" });
      }
      return res.status(200).json(leaveRequest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateLeaveRequest: async (req, res) => {
    try {
      const leaveRequestId = req.params.id;
      const { employee_id, leave_type, start_date, end_date, reason, status } = req.body;
      const leaveRequest = await db.leaveRequest.findByPk(leaveRequestId);
      if (!leaveRequest) {
        return res.status(404).json({ error: "Leave request not found" });
      }
      await leaveRequest.update({
        employee_id,
        leave_type,
        start_date,
        end_date,
        reason,
        status
      });
      return res.status(200).json(leaveRequest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteLeaveRequest: async (req, res) => {
    try {
      const leaveRequestId = req.params.id;
      const leaveRequest = await db.leaveRequest.findByPk(leaveRequestId);
      if (!leaveRequest) {
        return res.status(404).json({ error: "Leave request not found" });
      }
      await leaveRequest.destroy();
      return res.status(200).json({ message: "Leave request deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateLeaveRequestStatus: async (approvalHistoryId) => {
    try {
      // Find the approval history entry
      const approvalHistory = await db.approvalHistory.findByPk(approvalHistoryId, { include: [db.leaveRequest] });
      if (!approvalHistory) {
        console.error('Approval history entry not found');
        return;
      }

      // Update the status of the associated leave request
      const leaveRequest = approvalHistory.LeaveRequest;
      if (!leaveRequest) {
        console.error('Associated leave request not found');
        return;
      }

      // Update the status to 'approved'
      await leaveRequest.update({ status: 'approved' });

      console.log('Leave request status updated successfully');
    } catch (error) {
      console.error('Error updating leave request status:', error);
    }
  }

};

module.exports = LeaveRequestController;
