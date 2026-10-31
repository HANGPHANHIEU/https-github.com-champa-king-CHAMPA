export const Storage = {
    getUser: () => JSON.parse(localStorage.getItem('current_logged_user') || 'null'),
    setUser: (u) => u ? localStorage.setItem('current_logged_user', JSON.stringify(u)) : localStorage.removeItem('current_logged_user'),
    
    getAccepted: () => JSON.parse(localStorage.getItem('accepted_jobs_list') || '[]'),
    saveAccepted: (list) => localStorage.setItem('accepted_jobs_list', JSON.stringify(list)),

    getDeleted: () => JSON.parse(localStorage.getItem('app_deleted_jobs') || '[]'),
    saveDeleted: (list) => localStorage.setItem('app_deleted_jobs', JSON.stringify(list)),

    getWorkers: () => JSON.parse(localStorage.getItem('workers_list') || '[{"id":1,"name":"Trần Văn Bình","phone":"0988123456","location":"Châu Thành","skill":"Giao hàng hỏa tốc","status":"approved"}]'),
    saveWorker: (w) => {
        const list = Storage.getWorkers();
        list.unshift(w);
        localStorage.setItem('workers_list', JSON.stringify(list));
    }
};