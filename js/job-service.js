import { SUPABASE_URL, headers } from './config.js';
import { Storage } from './storage.js';

export const JobService = {
    // 1. Lấy danh sách công việc từ Supabase (fallback về Local Storage nếu lỗi)
    async fetchCloudJobs() {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*&order=id.desc`, { headers });
            const data = await res.json();
            return Array.isArray(data) ? data : (Storage.getJobs ? Storage.getJobs() : []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách từ Cloud, chuyển về Local Storage:", error);
            return Storage.getJobs ? Storage.getJobs() : [];
        }
    },

    // 2. Tạo công việc mới lên Supabase và lưu đồng bộ cục bộ
    async createCloudJob(jobData) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, { 
                method: 'POST', 
                headers: {
                    ...headers,
                    'Prefer': 'return=representation'
                }, 
                body: JSON.stringify(jobData) 
            });

            if (!res.ok) {
                throw new Error("Không thể tạo công việc trên Supabase.");
            }

            const data = await res.json();
            
            // Đồng bộ lưu cục bộ nếu Storage hỗ trợ
            if (Storage.getJobs && Storage.saveJobs) {
                const jobs = Storage.getJobs();
                const newJob = Array.isArray(data) ? data[0] : data;
                if (newJob) {
                    jobs.unshift(newJob);
                    Storage.saveJobs(jobs);
                }
            }

            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    // 3. Tính năng Nhận việc (Hỗ trợ cả Supabase và Local Storage)
    async takeJob(jobId) {
        const user = Storage.getUser();
        
        // Kiểm tra đăng nhập
        if (!user) {
            alert("Vui lòng đăng nhập tài khoản cá nhân trước khi nhận việc!");
            document.getElementById('authModal')?.classList.remove('hidden');
            return false;
        }

        // Lấy danh sách công việc (ưu tiên Cloud, fallback về Local)
        let jobs = [];
        let isCloud = true;
        try {
            jobs = await this.fetchCloudJobs();
        } catch {
            jobs = Storage.getJobs ? Storage.getJobs() : [];
            isCloud = false;
        }

        const job = jobs.find(j => j.id === jobId);

        if (!job) {
            alert("Không tìm thấy thông tin công việc!");
            return false;
        }

        // Kiểm tra nếu chính chủ tự nhận việc của mình
        if (job.phone === user.phone) {
            alert("Bạn không thể tự nhận công việc do chính mình đăng!");
            return false;
        }

        if (confirm(`Xác nhận nhận công việc: "${job.title || job.name}"?`)) {
            try {
                if (isCloud) {
                    // Cập nhật trạng thái công việc lên Supabase
                    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}`, {
                        method: 'PATCH',
                        headers: {
                            ...headers,
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            status: 'processing',
                            workerPhone: user.phone
                        })
                    });

                    if (!res.ok) {
                        throw new Error("Không thể cập nhật trạng thái nhận việc trên hệ thống.");
                    }
                }

                // Cập nhật trạng thái cục bộ
                if (Storage.getJobs && Storage.saveJobs) {
                    const localJobs = Storage.getJobs();
                    const localJob = localJobs.find(j => j.id === jobId);
                    if (localJob) {
                        localJob.status = 'processing';
                        localJob.workerPhone = user.phone;
                        Storage.saveJobs(localJobs);
                    }
                }

                alert("Nhận việc thành công! Chủ bài đăng sẽ liên hệ với bạn.");
                
                // Load lại giao diện nếu có hàm hỗ trợ
                if (typeof window.reloadJobs === 'function') {
                    window.reloadJobs();
                } else {
                    location.reload();
                }
                return true;
            } catch (error) {
                console.error(error);
                alert("Đã xảy ra lỗi khi nhận việc. Vui lòng thử lại!");
                return false;
            }
        }
        return false;
    },

    // 4. Tính năng Xóa việc (Kiểm tra quyền Chính chủ hoặc Admin, hỗ trợ chuyển vào Thùng rác)
    async deleteJob(jobId, jobOwnerPhone) {
        const currentUser = Storage.getUser();

        // Kiểm tra đăng nhập
        if (!currentUser) {
            alert("Vui lòng đăng nhập để thực hiện thao tác xóa!");
            return false;
        }

        // Lấy danh sách việc làm để xác định chủ bài đăng nếu chưa truyền vào
        let jobs = [];
        try {
            jobs = await this.fetchCloudJobs();
        } catch {
            jobs = Storage.getJobs ? Storage.getJobs() : [];
        }

        const job = jobs.find(j => j.id === jobId);
        let ownerPhone = jobOwnerPhone || (job ? job.phone : null);

        // Kiểm tra quyền: Chủ bài đăng hoặc Admin
        const isAdmin = sessionStorage.getItem('is_admin_active') === 'true';
        const isOwner = ownerPhone ? (currentUser.phone === ownerPhone) : true;

        if (!isOwner && !isAdmin) {
            alert("Bảo mật: Bạn không có quyền xóa bài đăng của người khác!");
            return false;
        }

        if (confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
            try {
                // Xóa trên Supabase
                const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}`, {
                    method: 'DELETE',
                    headers
                });

                if (!res.ok) {
                    throw new Error("Không thể xóa công việc từ cơ sở dữ liệu đám mây.");
                }

                // Xóa cục bộ và đưa vào thùng rác (Trash)
                if (Storage.getJobs && Storage.saveJobs) {
                    const localJobs = Storage.getJobs();
                    const index = localJobs.findIndex(j => j.id === jobId);
                    if (index !== -1) {
                        const removedJob = localJobs.splice(index, 1)[0];
                        Storage.saveJobs(localJobs);

                        // Lưu vào danh sách đã xóa nếu Storage có hỗ trợ
                        if (typeof Storage.getDeleted === 'function' && typeof Storage.saveDeleted === 'function') {
                            const deleted = Storage.getDeleted();
                            deleted.push(removedJob);
                            Storage.saveDeleted(deleted);
                        }
                    }
                } else if (job && typeof Storage.getDeleted === 'function' && typeof Storage.saveDeleted === 'function') {
                    const deleted = Storage.getDeleted();
                    deleted.push(job);
                    Storage.saveDeleted(deleted);
                }

                alert("Đã xóa bài đăng thành công!");

                // Cập nhật lại giao diện
                if (typeof window.reloadJobs === 'function') {
                    window.reloadJobs();
                } else {
                    location.reload();
                }
                return true;
            } catch (error) {
                console.error(error);
                alert("Đã xảy ra lỗi khi xóa công việc!");
                return false;
            }
        }
        return false;
    }
};