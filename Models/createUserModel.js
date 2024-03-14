module.exports = (sequelize, DataTypes) => {
    const CreateUser = sequelize.define("CreateUser", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING, 
            allowNull: false
        }
    }, { timestamps: true });
    return CreateUser;
};
