
module.exports = (sequelize, DataTypes) => {
    const Leave = sequelize.define("LeaveRequest", {
        leaveType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: true,
    });

    return Leave;
};
