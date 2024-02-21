
module.exports = (sequelize, DataTypes) => {
    const ApprovalHistory = sequelize.define("ApprovalHistory", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      leave_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      approver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      response: {
        type: DataTypes.ENUM('approved', 'rejected'),
        allowNull: false
      },
      comments: {
        type: DataTypes.STRING,
        allowNull: true
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });
    return ApprovalHistory;
  };
  