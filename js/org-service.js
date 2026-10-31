//Gọi API Supabase cho tổ chức
import { SUPABASE_URL, headers } from './config.js';

export const OrgService = {
    async fetchCloudOrgs() {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/organizations?select=*&order=id.desc`, { headers });
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch { return []; }
    },
    async createCloudOrg(orgData) {
        return fetch(`${SUPABASE_URL}/rest/v1/organizations`, { method: 'POST', headers, body: JSON.stringify(orgData) });
    }
};