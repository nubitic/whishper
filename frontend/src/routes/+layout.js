import { transcriptions, storageStats } from '$lib/stores';
import { browser, dev } from '$app/environment';
import { env } from '$env/dynamic/public';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    // Use different endpoints for server-side and client-side
    const endpoint = browser ? `${env.PUBLIC_API_HOST}/api/transcriptions` : `${env.PUBLIC_INTERNAL_API_HOST}/api/transcriptions`;
    const endpointBackendStorage = browser ? `${env.PUBLIC_API_HOST}/api/storagestats` : `${env.PUBLIC_INTERNAL_API_HOST}/api/storagestats`;

    const response = await fetch(endpoint);
    const ts = await response.json();

    if (ts) {
        transcriptions.update(_ => ts.length > 0 ? ts : []);
    } else {
        transcriptions.update(_ => []);
    }    

    const responseBS = await fetch(endpointBackendStorage);
    const backStorageStats = await responseBS.json();
    if (backStorageStats) {
        storageStats.update(_ => backStorageStats);
    } else {
        storageStats.update(_ => {});
    } 
}
