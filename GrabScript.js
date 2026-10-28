document.addEventListener('DOMContentLoaded', () => {
    console.log("GrabScript.js đã được tải và tương thích hoàn toàn với script.js!");

    // --- SỬ DỤNG LẠI HỆ THỐNG TOAST TỪ SCRIPT.JS (NẾU CÓ) HOẶC DỰ PHÒNG ---
    function triggerToast(message, type = 'success') {
        // Kiểm tra xem hàm showToast gốc từ script.js có tồn tại trên window hay không
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            // Hàm dự phòng nếu script.js chưa nạp kịp
            const existingToast = document.getElementById('appToast');
            if (existingToast) existingToast.remove();

            const toast = document.createElement('div');
            toast.id = 'appToast';
            toast.className = `fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-bold text-white shadow-xl transition-all duration-300 flex items-center gap-2 ${
                type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`;
            toast.innerHTML = `<i class="fa-solid fa-circle-check text-sm"></i> ${message}`;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    // --- TÍCH HỢP SỰ KIỆN CHO CÁC DỊCH VỤ TRONG GRAB.HTML ---
    const serviceItems = document.querySelectorAll('.grab-service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const serviceName = item.getAttribute('data-service') || 'Dịch vụ Grab';
            triggerToast(`Đang chuyển hướng đến: ${serviceName}...`, 'success');
        });
    });

    // --- ĐỒNG BỘ DỮ LIỆU VỚI LOCALSTORAGE CHUNG CỦA HỆ THỐNG ---
    function syncGrabActivity() {
        try {
            const grabActivityLog = {
                page: 'Grab Ecosystem',
                accessedAt: new Date().toLocaleString('vi-VN'),
                userSession: localStorage.getItem('my_jobs_list') ? 'Active' : 'Guest'
            };
            localStorage.setItem('last_grab_activity', JSON.stringify(grabActivityLog));
        } catch (e) {
            console.error("Không thể đồng bộ localStorage:", e);
        }
    }

    syncGrabActivity();
});