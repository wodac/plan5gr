const { Sequelize, Model, DataTypes } = require('sequelize');
const connection = require('../db')

class ScheduleEvent extends Model {
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