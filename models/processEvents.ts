import { CalendarEvent } from '../CalendarTime';
import { ScheduleKind, ScheduleEventType } from './ScheduleEvent';

export function processEventLabels(summary: string): {
    name: string;
    labels: Array<string>;
} {
    let name = summary;
    const labelTags = {
        '?': 'uncertain',
        'WYKŁAD': 'lecture',
        'BEZBLOCZE': 'background',
        'WAKACJE WIOSENNE': 'background',
        'PRZERWA WIOSENNA': 'background',
        'WOLNE': 'background',
        'FERIE ZIMOWE': 'background',
        'DZIEŃ REKTORSKI': 'background'
    };
    const tagMatcher = /\[([^\]]+)\]/y;
    let matching: RegExpExecArray, tag: string, label: string, labels = [], index: number;
    while (matching = tagMatcher.exec(summary)) {
        console.log({ matching })
        tag = matching[1];
        console.log({ tag })
        index = matching.index;
        label = labelTags[tag];
        if (label) labels.push(label);
    };
    if (tag) {
        const nameStart = index + tag.length + 2;
        name = summary.slice(nameStart).trim();
    }
    return {
        name, labels
    };
}
export function processCalendarEvent(event: CalendarEvent, kind: ScheduleKind): ScheduleEventType {
    const { start, end, summary } = event;
    const allDay = typeof start.date === 'string';
    let startTime, endTime;
    if (allDay) {
        startTime = new Date(start.date);
        endTime = new Date(end.date);
    } else {
        startTime = new Date(start.dateTime);
        endTime = new Date(end.dateTime);
    }
    const { name, labels } = processEventLabels(summary);
    labels.forEach(label => event[label] = true);
    event.summary = name;

    return {
        id: event.id,
        name, startTime, endTime, kind,
        data: event
    };
}
