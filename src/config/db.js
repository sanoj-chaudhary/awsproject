const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('chatdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const db = {};
const modelsPath = path.join(__dirname, '../models');


fs.readdirSync(modelsPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const modelFile = require(path.join(modelsPath, file));

    let model;
    // If the export is a function, call it with (sequelize, DataTypes)
    if (typeof modelFile === 'function') {
      model = modelFile(sequelize, DataTypes);
    }
    // If it’s already an initialized model, use it directly
    else if (modelFile && modelFile.name) {
      model = modelFile;
    }
    // If it’s an object containing the model, try to extract it
    else if (modelFile && modelFile.default) {
      model =
        typeof modelFile.default === 'function'
          ? modelFile.default(sequelize, DataTypes)
          : modelFile.default;
    } else {
      throw new Error(`Invalid model export in ${file}`);
    }

    db[model.name] = model;
  });

// Run associations if any
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
