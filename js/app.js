import { initTrashModal } from './trash-modal.js';
import { updateAuthUI } from './auth-modal.js';

// --- HÀM XỬ LÝ NHẬN VIỆC ---
window.handleTakeJob = (jobId) => {
    const isLoggedIn = localStorage.getItem('viecgap_logged_in') === 'true' || !!localStorage.getItem('user');
    
    if (!isLoggedIn) {
        alert("Vui lòng đăng nhập tài khoản trước khi nhận việc!");
        document.getElementById('authModal')?.classList.remove('hidden');
        document.getElementById('authModal')?.classList.add('flex');
        return;
    }

    const jobs = JSON.parse(localStorage.getItem('viecgap_jobs') || '[]');
    const job = jobs.find(j => j.id === jobId);
    const currentUserPhone = localStorage.getItem('viecgap_user_phone');

    if (job && job.phone === currentUserPhone) {
        alert("Bạn không thể tự nhận công việc do chính mình đăng!");
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn nhận công việc này không?`)) {
        alert("Nhận việc thành công! Chủ bài đăng sẽ liên hệ với bạn.");
    }
};

// --- HÀM XỬ LÝ XÓA VIỆC (Chỉ chính chủ) ---
window.handleDeleteJob = (jobId) => {
    const currentUserPhone = localStorage.getItem('viecgap_user_phone');
    const jobs = JSON.parse(localStorage.getItem('viecgap_jobs') || '[]');
    const job = jobs.find(j => j.id === jobId);

    if (!currentUserPhone) {
        alert('Vui lòng đăng nhập để thực hiện tính năng xóa!');
        return;
    }

    if (job && job.phone !== currentUserPhone) {
        alert('Bạn không có quyền xóa công việc do người khác đăng!');
        return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) {
        const updatedJobs = jobs.filter(j => j.id !== jobId);
        localStorage.setItem('viecgap_jobs', JSON.stringify(updatedJobs));

        // Đưa vào thùng rác
        if (job) {
            const deletedJobs = JSON.parse(localStorage.getItem('viecgap_deleted_jobs') || '[]');
            deletedJobs.push(job);
            localStorage.setItem('viecgap_deleted_jobs', JSON.stringify(deletedJobs));
        }

        alert('Đã xóa thành công!');
        renderJobs(); // Cập nhật lại giao diện ngay lập tức
    }
};

// --- HÀM RENDER DANH SÁCH VIỆC LÀM ---
export const renderJobs = () => {
    const jobListContainer = document.getElementById('jobList');
    const jobCountElement = document.getElementById('jobCount');
    if (!jobListContainer) return;

    const jobs = JSON.parse(localStorage.getItem('viecgap_jobs') || '[]');
    const currentUserPhone = localStorage.getItem('viecgap_user_phone');
    
    if (jobCountElement) {
        jobCountElement.innerText = `${jobs.length} việc phù hợp`;
    }

    if (jobs.length === 0) {
        jobListContainer.innerHTML = `
            <div class="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Chưa có công việc nào được đăng. Hãy đăng nhập và "Đăng việc" ngay!
            </div>
        `;
        return;
    }

    jobListContainer.innerHTML = jobs.map(job => {
        // Chỉ hiện nút Xóa nếu đúng là chính chủ đăng bài
        const isOwner = currentUserPhone && job.phone === currentUserPhone;

        return `
            <div class="bg-white border border-slate-100 hover:border-teal-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-3">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="bg-teal-50 text-teal-700 text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide">${job.category || 'Khác'}</span>
                            ${job.urgent ? '<span class="bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><i class="fa-solid fa-bolt text-[10px]"></i> Gấp</span>' : ''}
                        </div>
                        <h3 class="font-bold text-slate-900 text-base">${job.title}</h3>
                    </div>
                    <span class="text-teal-600 font-bold text-sm bg-teal-50 px-2.5 py-1 rounded-xl">${job.salary || 'Thỏa thuận'}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <div class="flex items-center gap-3">
                        <span><i class="fa-solid fa-location-dot text-slate-400 mr-1"></i>${job.location || 'Châu Thành'}</span>
                        <span><i class="fa-regular fa-clock text-slate-400 mr-1"></i>${job.createdAt || ''}</span>
                    </div>
                    <div class="flex gap-2">
                        <!-- Gắn trực tiếp hàm onclick giúp nút chắc chắn ăn sự kiện -->
                        <button type="button" onclick="window.handleTakeJob('${job.id}')" class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer">
                            Nhận việc
                        </button>
                        ${isOwner ? `
                            <button type="button" onclick="window.handleDeleteJob('${job.id}')" class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer">
                                Xóa
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

// --- KHỞI TẠO KHI TẢI TRANG ---
document.addEventListener('DOMContentLoaded', () => {
    initTrashModal();
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
    renderJobs(); // Gọi render danh sách việc làm khi vừa vào trang
});