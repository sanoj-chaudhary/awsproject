module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    profile_pic: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('online', 'offline'), defaultValue: 'offline' },
    last_seen: { type: DataTypes.DATE },
    online: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
},
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: 'sender_id', as: 'messages' });
  };

  return User;
};
