const db = require("../Models");

const notificationLogController = {
    createNotificationLog: async (req, res) => {
        try {
            const { recipient_UserId, notification_type, message_content ,approver_id,UserId} = req.body;
            const notificationLog = await db.notificationLog.create({
                approver_id,
                recipient_UserId,
                notification_type,
                message_content,
                UserId
            });
            return res.status(201).json(notificationLog);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getAllNotificationLogs: async (req, res) => {
        try {
            const notificationLogs = await db.notificationLog.findAll();
            return res.status(200).json(notificationLogs);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getNotificationLogById: async (req, res) => {
        try {
            const notificationLogId = req.params.id;
            const notificationLog = await db.notificationLog.findByPk(notificationLogId);
            if (!notificationLog) {
                return res.status(404).json({ error: "Notification log entry not found" });
            }
            return res.status(200).json(notificationLog);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateNotificationLog: async (req, res) => {
        try {
            const notificationLogId = req.params.id;
            const { recipient_UserId, notification_type, message_content } = req.body;
            let notificationLog = await db.notificationLog.findByPk(notificationLogId);
            if (!notificationLog) {
                return res.status(404).json({ error: 'Notification log entry not found' });
            }
            notificationLog = await notificationLog.update({
                approver_id,
                recipient_UserId,
                notification_type,
                message_content
            });
            return res.status(200).json(notificationLog);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteNotificationLog: async (req, res) => {
        try {
            const notificationLogId = req.params.id;
            const notificationLog = await db.notificationLog.findByPk(notificationLogId);
            if (!notificationLog) {
                return res.status(404).json({ error: 'Notification log entry not found' });
            }
            await notificationLog.destroy();
            return res.status(200).json({ message: 'Notification log entry deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
module.exports = notificationLogController;
