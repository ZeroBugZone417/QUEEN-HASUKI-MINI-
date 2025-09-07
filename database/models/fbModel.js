const { DataTypes } = require('sequelize');
const { database } = require('../connection');

const FacebookVideo = database.define('FacebookVideo', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    thumbnail: { type: DataTypes.STRING },
    duration: { type: DataTypes.STRING },
    normalQualityLink: { type: DataTypes.STRING },
    hdQualityLink: { type: DataTypes.STRING },
    requestedBy: { type: DataTypes.STRING } // WhatsApp sender JID
}, {
    tableName: 'facebook_videos',
    timestamps: true
});

module.exports = FacebookVideo;
