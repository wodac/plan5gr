import { Model, DataTypes } from 'sequelize';
import connection from '../db';
import { SyncMetadataType } from './SyncMetadataType';

class SyncMetadata extends Model<SyncMetadataType, SyncMetadataType> implements SyncMetadataType {
    public id: number;
    public lastRetrieved: Date;
    public scheduleSyncToken: string;
    public examsSyncToken: string;

    static async getMetadata() {
        return SyncMetadata.findOne();
    }

    static async setMetadata(data: Partial<SyncMetadataType>) {
        return SyncMetadata.upsert({
                id: 0, lastRetrieved: new Date(), 
                examsSyncToken: null, scheduleSyncToken: null,
                ...data
            }, 
        {});
    }
}

SyncMetadata.init({
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true
    },
    lastRetrieved: {
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

export default SyncMetadata;