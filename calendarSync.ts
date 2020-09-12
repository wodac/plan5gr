import { ClientRequest } from "http";
import { SyncMetadataType } from "./models/SyncMetadataType";
const baseURL = 'https://script.google.com/macros/s/AKfycbyrALm8xhIL7J_YQqAQsZNyress3_2xPtlskzCx7_rPQDIwBys/exec';

export default async function (syncData: SyncMetadataType) {
    const url = baseURL + '?' + new URLSearchParams({        
        ...syncData,
        lastSynced: syncData.lastSynced.toISOString()
    }).toString();
    return new Promise((resolve, reject) => {
        new ClientRequest(url, (res) => {
            res.on("readable", () => {
                const response = res.read();
                resolve(JSON.parse(response));
            });
            res.on("error", err => reject(err) );
        })
    })
}