import { Model, DataTypes } from 'sequelize';
import connection from '../db';
import { SyncMetadataType } from './SyncMetadataType';

class SyncMetadata extends Model<SyncMetadataType, SyncMetadataType> implements SyncMetadataType {
    public lastSynced: Date;
    public scheduleSyncToken: string;
    public examsSyncToken: string;

    static async getMetadata() {
        return SyncMetadata.findOne();
    }

    static async setMetadata(data: SyncMetadataType) {
        return SyncMetadata.update(data, {
            where: {}
        });
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