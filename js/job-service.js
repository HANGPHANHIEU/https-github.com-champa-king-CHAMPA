//Gọi API Supabase cho công việc
import { SUPABASE_URL, headers } from './config.js';

export const JobService = {
    async fetchCloudJobs() {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*&order=id.desc`, { headers });
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch { return []; }
    },
    async createCloudJob(jobData) {
        return fetch(`${SUPABASE_URL}/rest/v1/jobs`, { method: 'POST', headers, body: JSON.stringify(jobData) });
    },
    async deleteCloudJob(id) {
        return fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, { method: 'DELETE', headers });
    }
};