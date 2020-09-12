import { Sequelize, Model, DataTypes } from 'sequelize';
const connection = require('../db');

class SyncMetadata extends Model {
    static getMetadata() {
        return SyncMetadata.findOne();
    }
}

SyncMetadata.init({
    lastSynced: {
        type: DataTypes.DATE
    },
    scheduleSyncToken: {
        type: DataTypes.TEXT
    },
    examsSyncToken: {
        type: DataTypes.TEXT
    }
}, {
    sequelize: connection
});

module.exports = SyncMetadata;