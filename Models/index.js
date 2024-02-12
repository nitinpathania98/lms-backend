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

// Define associations
db.User.hasOne(Profile, { foreignKey: 'UserId', as: 'Profile' });
db.Profile.belongsTo(User, { foreignKey: 'UserId' });

//exporting the module
module.exports = db