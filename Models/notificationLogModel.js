module.exports = (sequelize, DataTypes) => {
    const NotificationLog = sequelize.define("NotificationLog", {
        recipient_UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        approver_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        notification_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    return NotificationLog;
};
