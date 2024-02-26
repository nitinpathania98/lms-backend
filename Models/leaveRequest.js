module.exports = (sequelize, DataTypes) => {
    const LeaveRequest = sequelize.define("LeaveRequest", {
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        leaveType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        endDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending'
        }
    });

    return LeaveRequest;
};