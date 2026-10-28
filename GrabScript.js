document.addEventListener('DOMContentLoaded', () => {
    console.log("GrabScript.js đã được tải và tích hợp Deep Link mở trực tiếp App Grab!");

    // --- HỆ THỐNG THÔNG BÁO TOAST ---
    function triggerToast(message, type = 'success') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
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

    // --- XỬ LÝ MỞ APP GRAB HOẶC CHUYỂN HƯỚNG ---
    const serviceItems = document.querySelectorAll('.grab-service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn chặn hành vi mở link mặc định ngay lập tức
            
            const serviceName = item.getAttribute('data-service') || 'Dịch vụ Grab';
            const webFallbackUrl = item.getAttribute('href') || 'https://www.grab.com/vi/';

            triggerToast(`Đang mở ứng dụng Grab cho dịch vụ: ${serviceName}...`, 'success');

            // Kiểm tra xem là thiết bị di động hay máy tính
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isMobile) {
                // Thử mở qua Scheme của app Grab trên điện thoại
                // Grab sử dụng cấu trúc URI scheme chung: grab://
                window.location.href = "grab://open";

                // Sau 1.5 giây nếu app không mở (do chưa cài), tự động chuyển hướng sang Web/Store dự phòng
                setTimeout(() => {
                    window.location.href = webFallbackUrl;
                }, 1500);
            } else {
                // Nếu chạy trên máy tính (PC), mở trực tiếp trang web dịch vụ trong tab mới
                setTimeout(() => {
                    window.open(webFallbackUrl, '_blank');
                }, 500);
            }
        });
    });

    // --- ĐỒNG BỘ DỮ LIỆU LOCALSTORAGE ---
    function syncGrabActivity() {
        try {
            const grabActivityLog = {
                page: 'Grab Ecosystem with DeepLink',
                accessedAt: new Date().toLocaleString('vi-VN')
            };
            localStorage.setItem('last_grab_activity', JSON.stringify(grabActivityLog));
        } catch (e) {
            console.error("Không thể đồng bộ localStorage:", e);
        }
    }

    syncGrabActivity();
});