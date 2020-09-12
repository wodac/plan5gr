import { Sequelize, Model, DataTypes } from 'sequelize';
const connection = require('../db')


class ScheduleEvent extends Model {
    static async syncWithGoogle() {
        const Metadata = require('./SyncMetadata');
        const metadata = await Metadata.getMetadata();

        
    }
}

ScheduleEvent.init({
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