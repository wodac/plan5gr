import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import calendarSync from '../calendarSync';
import { CalendarEvent } from '../CalendarTime';
import connection from '../db';
import SyncMetadata from './SyncMetadata';

type ScheduleKind = 'schedule' | 'exams';

interface ScheduleEventType {
    id: string,
    name: string,
    startTime: Date,
    endTime: Date,
    kind: ScheduleKind,
    data: any
}

function processCalendarEvent(event: CalendarEvent, kind: ScheduleKind): ScheduleEventType {
    const {start, end} = event;
    const allDay = typeof start.date === 'string';
    let startTime, endTime;
    if (allDay) {
        startTime = new Date(start.date);
        endTime = new Date(end.date);
    } else {
        startTime = new Date(start.dateTime);
        endTime = new Date(end.dateTime);
    }
    return {
        id: event.id,
        name: event.summary,
        startTime, endTime, kind,
        data: event
    }
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
        const metadata = await SyncMetadata.getMetadata();
        const syncedEvents = await calendarSync(metadata);
        
        ScheduleEvent.bulkCreate(
            syncedEvents.schedule.added.map(ev => processCalendarEvent(ev, 'schedule'))
        );
        ScheduleEvent.bulkCreate(
            syncedEvents.exams.added.map(ev => processCalendarEvent(ev, 'exams'))
        );

        syncedEvents.schedule.modified.forEach((event) => {
            ScheduleEvent.upsert(processCalendarEvent(event, 'schedule'));
        });
        syncedEvents.exams.modified.forEach((event) => {
            ScheduleEvent.upsert(processCalendarEvent(event, 'exams'));
        });
        
        ScheduleEvent.destroy({
            where: {
                id: syncedEvents.schedule.cancelled.map(ev => ev.id).concat(
                    syncedEvents.exams.cancelled.map(ev => ev.id))
            }
        });

        SyncMetadata.setMetadata({
            lastRetrieved: new Date(),
            examsSyncToken: syncedEvents.exams.nextSyncToken,
            scheduleSyncToken: syncedEvents.schedule.nextSyncToken
        });

        return syncedEvents;
    }

    static async getEvents(from: Date, to: Date) {
        if (to < from) throw RangeError("'From' date should be before 'to' date!");
        if ((to.valueOf() - from.valueOf()) > 1000 * 60 * 60 * 24 * 90) throw RangeError("Date range should be below 90 days!");
        return ScheduleEvent.findAll({ 
            where: { 
                startTime: { 
                    [Op.gt]: from 
                }, 
                endTime: { 
                    [Op.lt]: to 
                } 
            } 
        })
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
    sequelize: connection,
    paranoid: true,
    timestamps: true
});

export default ScheduleEvent;