module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define("Attachment", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    message_id: { type: DataTypes.BIGINT, allowNull: false },
    file_name: { type: DataTypes.STRING },
    file_url: { type: DataTypes.STRING },
    file_type: { type: DataTypes.STRING },
    file_size: { type: DataTypes.BIGINT }
  }, {
    tableName: 'attachments',
    timestamps: true
  });

  return Attachment;
};
