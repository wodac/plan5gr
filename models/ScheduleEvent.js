const { Sequelize, Model, DataTypes } = require('sequelize');
const connection = require('../db')

class ScheduleEvent extends Model {
    getData() {
        return JSON.parse(this.data);
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
        allowNull: false
    }
}, {
    sequelize: connection
});

module.exports = ScheduleEvent;