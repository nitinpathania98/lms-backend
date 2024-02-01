module.exports = (sequelize, DataTypes) => {
    const LeaveSubmit = sequelize.define("leaveSubmit", {
        leaveType: {
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
        primaryKey: false,
        timestamps: true
    },
    );
    return LeaveSubmit
};