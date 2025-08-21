module.exports = (sequelize, DataTypes) => {
  const ChatMember = sequelize.define("ChatMember", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'member'), defaultValue: 'member' }
  }, {
    tableName: 'chat_members',
    timestamps: true
  });
  ChatMember.associate = models => {
        ChatMember.belongsTo(models.User, { as: "user", foreignKey: "user_id" });
        models.Message.belongsTo(models.User, { as: "receiver", foreignKey: "receiver_id" });
    };

  return ChatMember;
};
