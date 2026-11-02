import { initAuthModal } from './auth-modal.js';
import { initPostJobModal } from './post-job-modal.js';
import { initOrgModals } from './org-modal.js';
import { initTrashModal } from './trash-modal.js';
import { initJobModule } from './job-service.js';
import { renderJobs, renderOrganizations } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- KHỞI ĐỘNG HỆ THỐNG 'VIỆC GẤP' ---");

    // 1. Dọn dẹp triệt để các lớp phủ modal bị kẹt (nếu có)
    document.querySelectorAll('[id$="Modal"], [id$="modal"]').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    // 2. Khởi tạo các module dịch vụ nền
    if (typeof initJobModule === 'function') initJobModule();

    // 3. Khởi tạo các Modal tương ứng với các nút trên index.html
    const trash = typeof initTrashModal === 'function' ? initTrashModal() : null;

    // Nút đăng nhập/tài khoản (#btnLoginAccount)
    if (typeof initAuthModal === 'function') {
        initAuthModal(() => { 
            renderJobs(); 
            if (trash && typeof trash.updateUI === 'function') trash.updateUI(); 
        });
    }
    
    // Nút đăng việc (#btnPostJob và #btnFloatingPostJob)
    if (typeof initPostJobModal === 'function') {
        initPostJobModal(() => renderJobs());
    }
    
    // Nút tổ chức (#btnJoinOrg và tab Tổ chức)
    if (typeof initOrgModals === 'function') {
        initOrgModals(() => renderOrganizations());
    }

    // 4. Xử lý chuyển đổi các Tab dưới thanh Navigation
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

            if (tabId === 'tabOrganization' && typeof renderOrganizations === 'function') {
                renderOrganizations();
            }
        });
    });

    // 5. Tải danh sách việc làm mặc định khi mở trang
    if (typeof renderJobs === 'function') renderJobs();
});