document.addEventListener('DOMContentLoaded', () => {
    console.log("GrabScript.js đã được tải và sẵn sàng hoạt động cùng hệ thống Việc Gấp!");

    // --- XỬ LÝ HIỆN THỊ THÔNG BÁO TOAST DÙNG CHUNG (Tương thích script.js) ---
    function showGrabToast(message, type = 'success') {
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

    // --- TÍCH HỢP SỰ KIỆN CHO CÁC DỊCH VỤ TRONG GRAB.HTML ---
    const serviceItems = document.querySelectorAll('.grab-service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const serviceName = item.getAttribute('data-service') || 'Dịch vụ Grab';
            showGrabToast(`Đang chuyển hướng đến: ${serviceName}...`, 'success');
        });
    });

    // --- ĐỒNG BỘ DỮ LIỆU LOCALSTORAGE (nếu cần chia sẻ giữa index.html và Grab.html) ---
    function syncGrabActivity() {
        try {
            const grabActivityLog = {
                page: 'Grab Ecosystem',
                accessedAt: new Date().toLocaleString('vi-VN')
            };
            localStorage.setItem('last_grab_activity', JSON.stringify(grabActivityLog));
        } catch (e) {
            console.error("Không thể lưu trạng thái vào localStorage:", e);
        }
    }

    syncGrabActivity();
});