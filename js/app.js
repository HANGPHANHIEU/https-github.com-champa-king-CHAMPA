import { initAuthModal } from './auth-modal.js';
import { initPostJobModal } from './post-job-modal.js';
import { initOrgModals } from './org-modal.js';
import { initTrashModal } from './trash-modal.js';
import { initJobModule } from './job-service.js';
import { renderJobs, renderOrganizations } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- HỆ THỐNG 'VIỆC GẤP' ĐÃ KHỞI ĐỘNG ---");

    // 1. Dọn dẹp triệt để: Tự động ẩn mọi modal/lớp phủ bị kẹt từ trước để giải phóng các nút bấm
    document.querySelectorAll('[id*="Modal"], [id*="modal"]').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    // 2. Khởi tạo module dịch vụ việc làm nền
    if (typeof initJobModule === 'function') {
        initJobModule();
    }

    // 3. Khởi tạo tính năng thùng rác
    const trash = typeof initTrashModal === 'function' ? initTrashModal() : null;

    // 4. Khởi tạo các Modal xác thực và tương tác
    if (typeof initAuthModal === 'function') {
        initAuthModal(() => { 
            renderJobs(); 
            if (trash && typeof trash.updateUI === 'function') {
                trash.updateUI(); 
            }
        });
    }
    
    if (typeof initPostJobModal === 'function') {
        initPostJobModal(() => renderJobs());
    }
    
    if (typeof initOrgModals === 'function') {
        initOrgModals(() => renderOrganizations());
    }

    // 5. Xử lý sự kiện chuyển đổi các Tab trên giao diện
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (!tabId) return;
            
            // Ẩn hiện nội dung các tab tương ứng
            document.querySelectorAll('.tab-content').forEach(t => {
                if (t.id === tabId) {
                    t.classList.remove('hidden');
                } else {
                    t.classList.add('hidden');
                }
            });

            // Nếu chuyển sang tab Tổ chức thì gọi hàm render dữ liệu tổ chức
            if (tabId === 'tabOrganization' && typeof renderOrganizations === 'function') {
                renderOrganizations();
            }
        });
    });

    // 6. Tải dữ liệu việc làm hiển thị mặc định khi mở trang
    if (typeof renderJobs === 'function') {
        renderJobs();
    }
});