import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { handleCompleteJobWithCommission } from './commission.js';

// --- CẤU HÌNH SUPABASE ---
const SUPABASE_URL = 'https://rznzypehvmwysxmjxxxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bnp5cGVodm13eXN4bWp4eHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNTkxNTYsImV4cCI6MjEwODkzNTE1Nn0.B-5onxhT0EoqgtJ0ZP-ZbGSz4Gmo7xuRPEcsAYz65wA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- TRANG QUẢN LÝ NHÂN SỰ & HOÀN TẤT ĐÃ KHỞI ĐỘNG ---");

    const acceptedJobListManagement = document.getElementById('acceptedJobListManagement');
    const activeJobCountBadge = document.getElementById('activeJobCountBadge');
    
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminPanel = document.getElementById('adminPanel');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const btnAdminLogin = document.getElementById('btnAdminLogin');
    const btnAdminLogout = document.getElementById('btnAdminLogout');
    const pendingWorkerList = document.getElementById('pendingWorkerList');
    const workerCountBadge = document.getElementById('workerCountBadge');

    // --- 1. TẢI DANH SÁCH CÔNG VIỆC ĐANG THỰC HIỆN & NÚT HOÀN TẤT ---
    window.loadManagementData = async () => {
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'accepted')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Lỗi tải danh sách việc:", error.message);
            return;
        }

        const activeJobs = jobs || [];
        if (activeJobCountBadge) {
            activeJobCountBadge.textContent = `Đang thực hiện: ${activeJobs.length}`;
        }

        if (activeJobs.length === 0) {
            acceptedJobListManagement.innerHTML = `
                <div class="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    Hiện chưa có công việc nào đang có thợ nhận thực hiện.
                </div>
            `;
            return;
        }

        acceptedJobListManagement.innerHTML = activeJobs.map(job => `
            <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">${job.category || 'Service'}</span>
                        <span class="text-slate-400 text-[10px]">Lương: <strong class="text-teal-700">${job.salary}</strong></span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm mt-1">${job.title}</h4>
                    <p class="text-slate-500 mt-0.5">📍 Khu vực: ${job.location || 'Châu Thành'}</p>
                </div>

                <div class="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div class="bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
                        <span class="text-teal-800 font-semibold"><i class="fa-solid fa-user-check mr-1"></i> Thợ nhận:</span>
                        <a href="tel:${job.accepted_by}" class="font-bold text-teal-700 hover:underline">📞 ${job.accepted_by}</a>
                    </div>

                    <!-- NÚT HOÀN TẤT CÔNG VIỆC VÀ TÍNH HOA HỒNG 1% -->
                    <button onclick="window.completeJobFromManagement('${job.id}', '${job.salary}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold transition text-xs flex items-center gap-1.5 shadow cursor-pointer">
                        <i class="fa-solid fa-circle-check"></i> Hoàn tất (Thu 1% Phí)
                    </button>
                </div>
            </div>
        `).join('');
    };

    // Hàm gọi sự kiện hoàn tất và tích hợp file commission.js
    window.completeJobFromManagement = (jobId, salaryStr) => {
        handleCompleteJobWithCommission(jobId, salaryStr, () => {
            // Sau khi hoàn thành xong, tự động tải lại danh sách
            window.loadManagementData();
        });
    };

    // --- 2. QUẢN LÝ ĐĂNG NHẬP ADMIN & DUYỆT THỢ ---
    const checkAdminSession = () => {
        const isAdmin = sessionStorage.getItem('viecgap_admin_logged') === 'true';
        if (isAdmin) {
            adminLoginSection?.classList.add('hidden');
            adminPanel?.classList.remove('hidden');
            loadPendingWorkers();
        } else {
            adminLoginSection?.classList.remove('hidden');
            adminPanel?.classList.add('hidden');
        }
    };

    btnAdminLogin?.addEventListener('click', () => {
        const pass = adminPasswordInput?.value;
        // Mật khẩu mặc định Admin là 'admin123' (anh có thể thay đổi tùy ý)
        if (pass === 'admin123' || pass === '123456') {
            sessionStorage.setItem('viecgap_admin_logged', 'true');
            alert('🔓 Đăng nhập quyền Admin thành công!');
            checkAdminSession();
        } else {
            alert('❌ Mật khẩu Admin không chính xác!');
        }
    });

    btnAdminLogout?.addEventListener('click', () => {
        sessionStorage.removeItem('viecgap_admin_logged');
        adminPasswordInput.value = '';
        checkAdminSession();
    });

    const loadPendingWorkers = async () => {
        const { data: workers, error } = await supabase.from('workers').select('*');
        if (error) return;

        const allWorkers = workers || [];
        if (workerCountBadge) workerCountBadge.textContent = `Tổng thợ: ${allWorkers.length}`;

        const pending = allWorkers.filter(w => w.status === 'pending');
        if (pending.length === 0) {
            pendingWorkerList.innerHTML = `<div class="text-center py-4 text-slate-400 text-xs">Không có hồ sơ thợ nào chờ duyệt.</div>`;
            return;
        }

        pendingWorkerList.innerHTML = pending.map(w => `
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                    <strong>${w.name}</strong> - 📞 ${w.phone}<br>
                    <span class="text-slate-500">Khu vực: ${w.location} | Kỹ năng: ${w.skill}</span>
                </div>
                <button onclick="window.approveWorker('${w.id}')" class="bg-teal-600 text-white font-bold px-3 py-1.5 rounded-lg">Duyệt hồ sơ</button>
            </div>
        `).join('');
    };

    window.approveWorker = async (workerId) => {
        const { error } = await supabase.from('workers').update({ status: 'approved' }).eq('id', workerId);
        if (!error) {
            alert('✅ Đã phê duyệt hồ sơ thợ thành công!');
            loadPendingWorkers();
        }
    };

    // Khởi chạy dữ liệu
    window.loadManagementData();
    checkAdminSession();

    // Realtime Sync
    supabase.channel('public:management_live_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => window.loadManagementData())
        .subscribe();
});