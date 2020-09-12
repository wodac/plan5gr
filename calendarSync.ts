import Axios from "axios";
import { ScheduleSyncResult } from "./CalendarTime";
import { SyncMetadataType } from "./models/SyncMetadataType";
const baseURL = 'https://script.google.com/macros/s/AKfycbyrALm8xhIL7J_YQqAQsZNyress3_2xPtlskzCx7_rPQDIwBys/exec';

export default async function (syncData: SyncMetadataType): Promise<ScheduleSyncResult> {
    const params: any = {
        lastRetrieved: syncData.lastRetrieved.toISOString(),
        action: 'syncEvents'
    };
    if (syncData.examsSyncToken) params.examsSyncToken = syncData.examsSyncToken;
    if (syncData.scheduleSyncToken) params.scheduleSyncToken = syncData.scheduleSyncToken;
    const url = baseURL + '?' + new URLSearchParams(params).toString();
    const result = await Axios.get(url);
    const data: ScheduleSyncResult = result.data;
    const error = data.schedule.error || data.exams.error;
    if (error) throw new Error(error);
    return data;
}