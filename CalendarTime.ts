type CalendarTime = {
    timeZone: string;
    dateTime: string;
};
type CalendarDate = {
    date: string;
};
type CalendarAttachment = {
    fileId: string;
    mimeType: string;
    fileUrl: string;
    iconLink: string;
    title: string;
};
export type CalendarEvent = {
    id: string;
    description?: string;
    start: CalendarTime & CalendarDate;
    end: CalendarTime & CalendarDate;
    summary: string;
    colorId: string;
    location?: string;
    htmlLink: string;
    attachments?: [CalendarAttachment];
};
type CalendarSyncResult = {
    cancelled?: [CalendarEvent];
    modified?: [CalendarEvent];
    added?: [CalendarEvent];
    nextSyncToken?: string;
    error?: string;
};
export type ScheduleSyncResult = {
    schedule?: CalendarSyncResult;
    exams?: CalendarSyncResult;
};
