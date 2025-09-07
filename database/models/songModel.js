const { DataTypes } = require('sequelize');
const { database } = require('../connection');

const Song = database.define('Song', {
    title: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.STRING },
    requestedBy: { type: DataTypes.STRING }
}, {
    tableName: 'songs',
    timestamps: true
});

module.exports = Song;
