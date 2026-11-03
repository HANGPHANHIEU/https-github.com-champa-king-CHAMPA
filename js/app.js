document.addEventListener('DOMContentLoaded', () => {
    console.log("--- HỆ THỐNG 'VIỆC GẤP' ĐÃ KHỞI ĐỘNG (SAFE MODE) ---");

    // 1. Dọn dẹp tất cả modal bị kẹt
    document.querySelectorAll('[id*="Modal"], [id*="modal"]').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });
    // --- XỬ LÝ ĐĂNG VIỆC VÀ HIỂN THỊ RA GIAO DIỆN ---
    const postJobModal = document.getElementById('postJobModal');
    const postJobForm = document.getElementById('postJobForm');

    const openPostJob = () => {
        postJobModal?.classList.remove('hidden');
        postJobModal?.classList.add('flex');
    };
    const authModal = document.getElementById('authModal');
    const authForm = document.getElementById('authForm');

    const closeAuthModal = () => {
        authModal?.classList.add('hidden');
        authModal?.classList.remove('flex');
        authForm?.reset(); // Xóa sạch thông tin đã gõ khi bấm hủy
    };

    document.getElementById('btnCloseAuthModal')?.addEventListener('click', closeAuthModal);
    document.getElementById('btnCancelAuthModal')?.addEventListener('click', closeAuthModal);

    const closePostJobModal = () => {
        postJobModal?.classList.add('hidden');
        postJobModal?.classList.remove('flex');
        postJobForm?.reset();
    };

    document.getElementById('btnPostJob')?.addEventListener('click', openPostJob);
    document.getElementById('btnFloatingPostJob')?.addEventListener('click', openPostJob);
    document.getElementById('btnCloseModal')?.addEventListener('click', closePostJobModal);
    document.getElementById('btnCancelModal')?.addEventListener('click', closePostJobModal);

    // Bắt sự kiện khi bấm nút "Đăng ngay" trong form
    postJobForm?.addEventListener('submit', (e) => {
        e.preventDefault(); // Chặn hành vi tải lại trang mặc định của form

        // 1. Lấy dữ liệu từ các ô nhập trong modal
        const newJob = {
            id: 'job_' + Date.now(),
            title: document.getElementById('jobTitleInput')?.value || 'Công việc mới',
            location: document.getElementById('jobLocationInput')?.value || 'Châu Thành',
            category: document.getElementById('jobCategoryInput')?.value || 'delivery',
            salary: document.getElementById('jobSalaryInput')?.value || 'Thỏa thuận',
            urgent: document.getElementById('jobUrgentInput')?.checked || false,
            createdAt: new Date().toLocaleDateString('vi-VN')
        };

        // 2. Lưu vào LocalStorage (Bộ nhớ trình duyệt) để không bị mất khi F5
        let jobs = JSON.parse(localStorage.getItem('viecgap_jobs') || '[]');
        jobs.unshift(newJob); // Đưa bài mới lên đầu danh sách
        localStorage.setItem('viecgap_jobs', JSON.stringify(jobs));

        // 3. Đóng modal và làm trống form
        closePostJobModal();

        // 4. Gọi hàm hiển thị lại danh sách việc làm ngoài giao diện (Nếu có hàm render)
        if (typeof renderJobs === 'function') {
            renderJobs();
        } else {
            // Nếu chưa có hàm render riêng, tự động tải lại trang để hiển thị việc mới
            location.reload();
        }
    });

    // 2. Gán sự kiện mở/đóng Modal Đăng nhập
    // Xử lý mở Modal Đăng nhập (Bắt toàn bộ các ID phổ biến)
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
        } else {
            console.warn("Không tìm thấy khung #authModal trong file index.html!");
        }
    };

    const closeAuthModal = () => {
        authModal?.classList.add('hidden');
        authModal?.classList.remove('flex');
        authForm?.reset();
        resetForm?.reset();
    };

    // Gắn sự kiện cho các nút mở đăng nhập
    document.getElementById('btnLoginAccount')?.addEventListener('click', openAuthModal);
    document.getElementById('btnLogin')?.addEventListener('click', openAuthModal);
    document.getElementById('btnOpenAuthModal')?.addEventListener('click', openAuthModal);

    // Gắn sự kiện đóng modal (Nút X và nút Hủy)
    document.getElementById('btnCloseAuthModal')?.addEventListener('click', closeAuthModal);
    document.getElementById('btnCancelAuthModal')?.addEventListener('click', closeAuthModal);
    document.getElementById('btnCancelReset')?.addEventListener('click', closeAuthModal);
    document.getElementById('btnLoginAccount').addEventListener('click', () => {
    alert("Nút đăng nhập đã nhận click!");
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('authModal').classList.add('flex');
});
    document.getElementById('btnLoginAccount')?.addEventListener('click', openAuthModal);
    document.getElementById('btnLogin')?.addEventListener('click', openAuthModal);
    document.getElementById('btnOpenAuthModal')?.addEventListener('click', openAuthModal);

    document.getElementById('btnCloseAuthModal')?.addEventListener('click', () => authModal?.classList.add('hidden'));
    document.getElementById('btnCancelAuthModal')?.addEventListener('click', () => authModal?.classList.add('hidden'));

    // 3. Gán sự kiện cho Nút Đăng việc
    const postJobModal = document.getElementById('postJobModal');
    const openPostJob = () => {
        postJobModal?.classList.remove('hidden');
        postJobModal?.classList.add('flex');
    };
    const closePostJobModal = () => {
        postJobModal?.classList.add('hidden');
        postJobModal?.classList.remove('flex');
        postJobForm?.reset(); // Xóa sạch dữ liệu đã nhập khi bấm Hủy hoặc Đóng
    };
    document.getElementById('btnPostJob')?.addEventListener('click', openPostJob);
    document.getElementById('btnFloatingPostJob')?.addEventListener('click', openPostJob);
    document.getElementById('btnCloseModal')?.addEventListener('click', () => postJobModal?.classList.add('hidden'));
    document.getElementById('btnCancelModal')?.addEventListener('click', () => postJobModal?.classList.add('hidden'));

    // 4. Gán sự kiện cho Nút Tổ chức
    const orgModal = document.getElementById('orgModal');
    document.getElementById('btnJoinOrg')?.addEventListener('click', () => {
        orgModal?.classList.remove('hidden');
        orgModal?.classList.add('flex');
    });
    document.getElementById('btnCloseOrgModal')?.addEventListener('click', () => orgModal?.classList.add('hidden'));
    document.getElementById('btnCancelOrgModal')?.addEventListener('click', () => orgModal?.classList.add('hidden'));

    // 5. Gán sự kiện cho Nút Đăng ký cá nhân
    const workerModal = document.getElementById('workerModal');
    document.getElementById('btnRegisterWorker')?.addEventListener('click', () => {
        workerModal?.classList.remove('hidden');
        workerModal?.classList.add('flex');
    });
    document.getElementById('btnCloseWorkerModal')?.addEventListener('click', () => workerModal?.classList.add('hidden'));
    document.getElementById('btnCancelWorkerModal')?.addEventListener('click', () => workerModal?.classList.add('hidden'));

    // 6. Gán sự kiện cho Nút Thùng rác
    const trashModal = document.getElementById('trashModal');
    document.getElementById('btnOpenTrash')?.addEventListener('click', () => {
        trashModal?.classList.remove('hidden');
        trashModal?.classList.add('flex');
    });
    document.getElementById('btnCloseTrashModal')?.addEventListener('click', () => trashModal?.classList.add('hidden'));

    // 7. Xử lý chuyển đổi Tab ở thanh menu dưới
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