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
        localStorage.setItem('workers_list', JSON.stringify(list));
        localStorage.setItem('viecgap_workers', JSON.stringify(list));
    },
    // Hàm cập nhật trạng thái Worker (approved, pending, ...)
    updateWorkerStatus: (id, newStatus) => {
        let list = Storage.getWorkers();
        list = list.map(w => String(w.id) === String(id) ? { ...w, status: newStatus } : w);
        localStorage.setItem('workers_list', JSON.stringify(list));
        localStorage.setItem('viecgap_workers', JSON.stringify(list));
        window.dispatchEvent(new Event('storage')); // Kích hoạt đồng bộ real-time
        return list;
    },
    // Hàm xóa Worker (Từ chối)
    deleteWorker: (id) => {
        let list = Storage.getWorkers();
        list = list.filter(w => String(w.id) !== String(id));
        localStorage.setItem('workers_list', JSON.stringify(list));
        localStorage.setItem('viecgap_workers', JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
        return list;
    },

    // --- TỔ CHỨC / ĐỐI TÁC (ORGANIZATIONS) ---
    getOrgs: () => JSON.parse(localStorage.getItem('organizations_list') || localStorage.getItem('viecgap_orgs') || '[]'),
    saveOrg: (o) => {
        const list = Storage.getOrgs();
        list.unshift(o);
        localStorage.setItem('organizations_list', JSON.stringify(list));
        localStorage.setItem('viecgap_orgs', JSON.stringify(list));
    },
    // Hàm cập nhật trạng thái Organization (approved, pending, ...)
    updateOrgStatus: (id, newStatus) => {
        let list = Storage.getOrgs();
        list = list.map(o => String(o.id) === String(id) ? { ...o, status: newStatus } : o);
        localStorage.setItem('organizations_list', JSON.stringify(list));
        localStorage.setItem('viecgap_orgs', JSON.stringify(list));
        window.dispatchEvent(new Event('storage')); // Kích hoạt đồng bộ real-time
        return list;
    },
    // Hàm xóa Organization (Từ chối)
    deleteOrg: (id) => {
        let list = Storage.getOrgs();
        list = list.filter(o => String(o.id) !== String(id));
        localStorage.setItem('organizations_list', JSON.stringify(list));
        localStorage.setItem('viecgap_orgs', JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
        return list;
    }
};