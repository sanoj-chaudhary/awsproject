module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        chat_id: { type: DataTypes.BIGINT, allowNull: false },
        sender_id: { type: DataTypes.BIGINT, allowNull: false },
        sender_id: { type: DataTypes.INTEGER, allowNull: true },
        type: { type: DataTypes.ENUM('text', 'image', 'video', 'audio', 'file'), allowNull: true },
        file_url: { type: DataTypes.TEXT, allowNull: true },
        content: { type: DataTypes.TEXT, allowNull: false },
        seen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        tableName: 'messages',
        timestamps: true
    });

// Message.associate = models => {
//         Message.belongsTo(models.User, { as: "sender", foreignKey: "sender_id" });
//         Message.belongsTo(models.User, { as: "receiver", foreignKey: "receiver_id" });
//     };
    Message.associate = (models) => {
        Message.belongsTo(models.User, { as: "senderUser", foreignKey: "sender_id" });
        Message.belongsTo(models.User, { as: "receiverUser", foreignKey: "receiver_id" });
        Message.belongsTo(models.Chat, { foreignKey: 'chat_id', as: 'chat' });
        Message.hasMany(models.Attachment, { foreignKey: 'message_id', as: 'attachments' });
    };

    return Message;
};
