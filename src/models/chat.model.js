module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define("Chat", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM('private', 'group'), allowNull: false },
    created_by: { type: DataTypes.BIGINT, allowNull: false }
  }, {
    tableName: 'chats',
    timestamps: true
  });
//  Chat.associate = models => {
//         Chat.hasMany(models.ChatMember, { as: "members", foreignKey: "chat_id" });
//         Chat.hasMany(models.Message, { foreignKey: "chat_id" });
//     };
  Chat.associate = (models) => {
    Chat.hasMany(models.ChatMember, { as: "Chatmembers", foreignKey: "chat_id" });
    Chat.hasMany(models.Message, { foreignKey: 'chat_id', as: 'messages' });
    Chat.belongsToMany(models.User, { through: models.ChatMember, foreignKey: 'chat_id', as: 'members' });
  };

  return Chat;
};
