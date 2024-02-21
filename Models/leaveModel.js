
module.exports = (sequelize, DataTypes) => {
    const Leave = sequelize.define("Leave", {
        leaveType: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        },
        startDate: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        },
    }, {
        timestamps: true,
    });

    return Leave;
};
