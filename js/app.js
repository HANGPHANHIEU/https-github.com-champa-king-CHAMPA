import { initAuthModal } from './auth-modal.js';
import { initPostJobModal } from './post-job-modal.js';
import { initOrgModals } from './org-modal.js';
import { initTrashModal } from './trash-modal.js';
import { initJobModule } from './job-service.js';
import { renderJobs, renderOrganizations } from './render.js';

// Đợi cho toàn bộ HTML tải xong hoàn toàn mới khởi chạy hệ thống
document.addEventListener('DOMContentLoaded', () => {
    console.log("--- KIỂM TRA HỆ THỐNG & KHỞI TẠO ---");
    
    // 1. Bắt sự kiện click cho tất cả các thẻ button để theo dõi trên Console (F12)
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log("Đã bấm vào nút có ID/Text:", btn.id || btn.innerText);
        });
    });

    // 2. Khởi tạo module dịch vụ việc làm nền
    if (typeof initJobModule === 'function') {
        initJobModule();
    }

    // 3. Khởi tạo tính năng thùng rác
    const trash = typeof initTrashModal === 'function' ? initTrashModal() : null;

    // 4. Khởi tạo các Modal xác thực và tương tác
    initAuthModal(() => { 
        renderJobs(); 
        if (trash && typeof trash.updateUI === 'function') {
            trash.updateUI(); 
        }
    });
    
    initPostJobModal(() => renderJobs());
    
    initOrgModals(() => renderOrganizations());

    // 5. Xử lý sự kiện chuyển đổi các Tab trên giao diện
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Ẩn hiện nội dung các tab tương ứng
            document.querySelectorAll('.tab-content').forEach(t => {
                if (t.id === tabId) {
                    t.classList.remove('hidden');
                } else {
                    t.classList.add('hidden');
                }
            });

            // Nếu chuyển sang tab Tổ chức thì gọi hàm render dữ liệu tổ chức
            if (tabId === 'tabOrganization') {
                renderOrganizations();
            }
        });
    });

    // 6. Tải dữ liệu việc làm hiển thị mặc định khi mở trang
    renderJobs();
});