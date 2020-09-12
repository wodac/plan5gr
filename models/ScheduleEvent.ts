import { Sequelize, Model, DataTypes } from 'sequelize';
import connection from '../db';

interface ScheduleEventType {
    id: string,
    name: string,
    startTime: Date,
    endTime: Date,
    kind: 'schedule' | 'exams',
    data: any
}

class ScheduleEvent extends Model<ScheduleEventType, ScheduleEventType> 
implements ScheduleEventType {
    public id: string;
    public name: string;
    public startTime: Date;
    public endTime: Date;
    public kind: 'schedule' | 'exams';
    public data: any;

    static async syncWithGoogle() {
        const Metadata = require('./SyncMetadata');
        const metadata = await Metadata.getMetadata();

        
    }
}

ScheduleEvent.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kind: {
        type: DataTypes.ENUM('schedule', 'exams'),
        allowNull: false
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const json = this.getDataValue('data');
            return JSON.parse(json);
        },
        set(data) {
            this.setDataValue('data', JSON.stringify(data));
        }
    }
}, {
    sequelize: connection
});

module.exports = ScheduleEvent;