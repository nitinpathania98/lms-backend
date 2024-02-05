module.exports = (sequelize, DataTypes) => {
  const LeaveTypes = sequelize.define('LeaveTypes', {
    leave_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    leave_type_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leave_description: {
      type: DataTypes.TEXT,
    },
  });

  return LeaveTypes;
};