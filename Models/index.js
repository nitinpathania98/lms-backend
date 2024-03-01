//importing modules
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`postgres://postgres:Nitin21@localhost:5432/lms`, { dialect: "postgres" })

//checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Database connected to lms`)
}).catch((err) => {
    console.log(err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
User = db.User = require('./userModel')(sequelize, DataTypes)
db.leaves = require('./leaveModel')(sequelize, DataTypes)
db.leavetypes = require('./leaveTypesModel')(sequelize, DataTypes)
Profile = db.Profile = require('./profileModel')(sequelize, DataTypes)
db.approvalHistory = require('./approvalHistory')(sequelize, DataTypes)
db.leaveRequest = require('./leaveRequest')(sequelize, DataTypes)
db.notificationLog = require('./notificationLogModel')(sequelize, DataTypes);

// Define associations
db.User.hasOne(Profile, { foreignKey: 'UserId', as: 'Profile' });
db.User.hasMany(db.leaveRequest, { foreignKey: 'UserId', as: 'LeaveRequests' });
db.Profile.belongsTo(User, { foreignKey: 'UserId' });

db.approvalHistory.belongsTo(db.leaveRequest, { foreignKey: 'leave_request_id', onDelete: 'CASCADE' });
db.approvalHistory.belongsTo(db.User, { foreignKey: 'approver_id', onDelete: 'CASCADE' });

// Additional association for LeaveRequest
db.leaveRequest.belongsTo(db.User, { foreignKey: 'UserId', onDelete: 'CASCADE' });


//exporting the module
module.exports = db