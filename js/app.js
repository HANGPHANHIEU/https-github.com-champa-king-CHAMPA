document.addEventListener('DOMContentLoaded', () => {
    console.log("--- HỆ THỐNG 'VIỆC GẤP' ĐÃ KHỞI ĐỘNG (SAFE MODE) ---");

    // 1. Dọn dẹp tất cả modal bị kẹt khi mới tải trang
    document.querySelectorAll('[id*="Modal"], [id*="modal"]').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    // --- 2. XỬ LÝ MODAL ĐĂNG VIỆC ---
    const postJobModal = document.getElementById('postJobModal');
    const postJobForm = document.getElementById('postJobForm');

    const openPostJob = () => {
        postJobModal?.classList.remove('hidden');
        postJobModal?.classList.add('flex');
    };

    const closePostJobModal = () => {
        postJobModal?.classList.add('hidden');
        postJobModal?.classList.remove('flex');
        postJobForm?.reset(); // Xóa sạch dữ liệu khi đóng hoặc hủy
    };

    document.getElementById('btnPostJob')?.addEventListener('click', openPostJob);
    document.getElementById('btnFloatingPostJob')?.addEventListener('click', openPostJob);
    document.getElementById('btnCloseModal')?.addEventListener('click', closePostJobModal);
    document.getElementById('btnCancelModal')?.addEventListener('click', closePostJobModal);

    // Bắt sự kiện khi bấm nút "Đăng ngay" trong form
    postJobForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const newJob = {
            id: 'job_' + Date.now(),
            title: document.getElementById('jobTitleInput')?.value || 'Công việc mới',
            location: document.getElementById('jobLocationInput')?.value || 'Châu Thành',
            category: document.getElementById('jobCategoryInput')?.value || 'delivery',
            salary: document.getElementById('jobSalaryInput')?.value || 'Thỏa thuận',
            urgent: document.getElementById('jobUrgentInput')?.checked || false,
            createdAt: new Date().toLocaleDateString('vi-VN')
        };

        let jobs = JSON.parse(localStorage.getItem('viecgap_jobs') || '[]');
        jobs.unshift(newJob);
        localStorage.setItem('viecgap_jobs', JSON.stringify(jobs));

        closePostJobModal();

        if (typeof renderJobs === 'function') {
            renderJobs();
        } else {
            location.reload();
        }
    });

    // --- 3. XỬ LÝ MODAL ĐĂNG NHẬP & ĐỔI MẬT KHẨU ---
    const authModal = document.getElementById('authModal');
    const authForm = document.getElementById('authForm');
    const resetForm = document.getElementById('resetForm');
    const authModalTitle = document.getElementById('authModalTitle');

    const openAuthModal = () => {
        if (authModal) {
            authModal.classList.remove('hidden');
            authModal.classList.add('flex');
            authForm?.classList.remove('hidden');
            resetForm?.classList.add('hidden');
            if (authModalTitle) authModalTitle.innerText = "Đăng nhập tài khoản";
        }
    };

    const closeAuthModal = () => {
        authModal?.classList.add('hidden');
        authModal?.classList.remove('flex');
        authForm?.reset();
        resetForm?.reset();
    };

    // Gắn sự kiện mở Modal Đăng nhập
    document.getElementById('btnLoginAccount')?.addEventListener('click', openAuthModal);
    document.getElementById('btnLogin')?.addEventListener('click', openAuthModal);
    document.getElementById('btnOpenAuthModal')?.addEventListener('click', openAuthModal);

    // Gắn sự kiện đóng Modal Đăng nhập (Nút X và nút Hủy)
    document.getElementById('btnCloseAuthModal')?.addEventListener('click', closeAuthModal);
    document.getElementById('btnCancelAuthModal')?.addEventListener('click', closeAuthModal);
    document.getElementById('btnCancelReset')?.addEventListener('click', closeAuthModal);

    // Chuyển đổi qua lại giữa form Đăng nhập và Đổi mật khẩu
    document.getElementById('btnToggleReset')?.addEventListener('click', () => {
        authForm?.classList.add('hidden');
        resetForm?.classList.remove('hidden');
        if (authModalTitle) authModalTitle.innerText = "Đổi mật khẩu tài khoản";
    });

    document.getElementById('btnBackToLogin')?.addEventListener('click', () => {
        resetForm?.classList.add('hidden');
        authForm?.classList.remove('hidden');
        if (authModalTitle) authModalTitle.innerText = "Đăng nhập tài khoản";
    });

    // --- 4. XỬ LÝ MODAL TỔ CHỨC ---
    const orgModal = document.getElementById('orgModal');
    document.getElementById('btnJoinOrg')?.addEventListener('click', () => {
        orgModal?.classList.remove('hidden');
        orgModal?.classList.add('flex');
    });
    document.getElementById('btnCloseOrgModal')?.addEventListener('click', () => orgModal?.classList.add('hidden'));
    document.getElementById('btnCancelOrgModal')?.addEventListener('click', () => orgModal?.classList.add('hidden'));

    // --- 5. XỬ LÝ MODAL ĐĂNG KÝ CÁ NHÂN ---
    const workerModal = document.getElementById('workerModal');
    document.getElementById('btnRegisterWorker')?.addEventListener('click', () => {
        workerModal?.classList.remove('hidden');
        workerModal?.classList.add('flex');
    });
    document.getElementById('btnCloseWorkerModal')?.addEventListener('click', () => workerModal?.classList.add('hidden'));
    document.getElementById('btnCancelWorkerModal')?.addEventListener('click', () => workerModal?.classList.add('hidden'));

    // --- 6. XỬ LÝ MODAL THÙNG RÁC ---
    const trashModal = document.getElementById('trashModal');
    document.getElementById('btnOpenTrash')?.addEventListener('click', () => {
        trashModal?.classList.remove('hidden');
        trashModal?.classList.add('flex');
    });
    document.getElementById('btnCloseTrashModal')?.addEventListener('click', () => trashModal?.classList.add('hidden'));

    // --- 7. XỬ LÝ CHUYỂN ĐỔI TAB DƯỚI THANH NAVIGATION ---
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (!tabId) return;
            
            document.querySelectorAll('.tab-content').forEach(t => {
                if (t.id === tabId) {
                    t.classList.remove('hidden');
                } else {
                    t.classList.add('hidden');
                }
            });
        });
    });
});