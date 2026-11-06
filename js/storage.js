export const Storage = {
    // --- NGƯỜI DÙNG & XÁC THỰC ---
    getUser: () => JSON.parse(localStorage.getItem('current_logged_user') || 'null'),
    setUser: (u) => u ? localStorage.setItem('current_logged_user', JSON.stringify(u)) : localStorage.removeItem('current_logged_user'),
    
    getUsers: () => JSON.parse(localStorage.getItem('app_registered_users') || '[]'),
    saveUsers: (list) => localStorage.setItem('app_registered_users', JSON.stringify(list)),

    // --- CÔNG VIỆC (JOBS) ---
    getJobs: () => JSON.parse(localStorage.getItem('viecgap_jobs') || '[]'),
    saveJobs: (list) => localStorage.setItem('viecgap_jobs', JSON.stringify(list)),

    // --- CÔNG VIỆC ĐÃ NHẬN ---
    getAccepted: () => JSON.parse(localStorage.getItem('accepted_jobs_list') || '[]'),
    saveAccepted: (list) => localStorage.setItem('accepted_jobs_list', JSON.stringify(list)),

    // --- THÙNG RÁC ---
    getDeleted: () => JSON.parse(localStorage.getItem('app_deleted_jobs') || '[]'),
    saveDeleted: (list) => localStorage.setItem('app_deleted_jobs', JSON.stringify(list)),

    // --- HỒ SƠ CÁ NHÂN (WORKERS) ---
    getWorkers: () => JSON.parse(localStorage.getItem('workers_list') || localStorage.getItem('viecgap_workers') || '[]'),
    saveWorker: (w) => {
        const list = Storage.getWorkers();
        list.unshift(w);
        // Lưu đồng bộ cả 2 key để chống lệch dữ liệu với Admin
        localStorage.setItem('workers_list', JSON.stringify(list));
        localStorage.setItem('viecgap_workers', JSON.stringify(list));
    },

    // --- TỔ CHỨC / ĐỐI TÁC (ORGANIZATIONS) - [MỚI BỔ SUNG] ---
    getOrgs: () => JSON.parse(localStorage.getItem('organizations_list') || localStorage.getItem('viecgap_orgs') || '[]'),
    saveOrg: (o) => {
        const list = Storage.getOrgs();
        list.unshift(o);
        // Lưu đồng bộ cả 2 key để Admin nhận diện được ngay
        localStorage.setItem('organizations_list', JSON.stringify(list));
        localStorage.setItem('viecgap_orgs', JSON.stringify(list));
    }
};