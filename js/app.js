document.addEventListener('DOMContentLoaded', () => {
    console.log("--- HỆ THỐNG 'VIỆC GẤP' ĐÃ KHỞI ĐỘNG (SAFE MODE) ---");

    // 1. Dọn dẹp tất cả modal bị kẹt
    document.querySelectorAll('[id*="Modal"], [id*="modal"]').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    // 2. Gán sự kiện mở/đóng Modal Đăng nhập
    const authModal = document.getElementById('authModal');
    const openAuthModal = () => {
        if (authModal) {
            authModal.classList.remove('hidden');
            authModal.classList.add('flex');
        } else {
            console.warn("Không tìm thấy khung #authModal trong HTML! Anh/chị nhớ thêm đoạn HTML modal đăng nhập vào cuối file index.html.");
        }
    };
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