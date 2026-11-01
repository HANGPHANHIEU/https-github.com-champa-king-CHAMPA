import { SUPABASE_URL, headers } from './config.js';

export const OrgService = {
    // 1. Lấy danh sách tổ chức từ Supabase Cloud (có sắp xếp giảm dần theo id và xử lý an toàn)
    async fetchCloudOrgs() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/organizations?select=*&order=id.desc`, {
                method: 'GET',
                headers: headers
            });
            if (!response.ok) throw new Error('Không thể tải danh sách tổ chức');
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Lỗi lấy tổ chức:", error);
            return [];
        }
    },

    // 2. Gửi đăng ký/tạo tổ chức mới lên Supabase Cloud
    async registerOrg(orgData) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/organizations`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(orgData)
            });
            
            if (!response.ok) throw new Error('Không thể đăng ký tổ chức');
            return await response.json();
        } catch (error) {
            console.error("Lỗi đăng ký tổ chức:", error);
            return null;
        }
    }
};