// BỘ TỪ ĐIỂN SONG NGỮ ĐẶC NHIỆM CHO "VIỆC GẤP"
(function() {
    // Trạng thái ngôn ngữ lưu trữ
    if (!localStorage.getItem('app_language')) {
        localStorage.setItem('app_language', 'vi');
    }

    // Hàm thực thi đổi chữ trên toàn bộ giao diện bài đăng
    function applyTranslations() {
        const lang = localStorage.getItem('app_language') || 'vi';
        
        // 1. Cập nhật chữ trên nút bấm ngôn ngữ nếu tìm thấy
        const toggleText = document.getElementById('myLangToggleText');
        if (toggleText) {
            toggleText.textContent = lang === 'vi' ? 'EN (English)' : 'VN (Tiếng Việt)';
        }

        // 2. Quét toàn bộ nút trong bảng tin công việc (#jobList) để đổi ngôn ngữ tức thì
        document.querySelectorAll('#jobList button').forEach(btn => {
            const html = btn.innerHTML;
            if (lang === 'en') {
                if (html.includes('Nhận việc')) {
                    btn.innerHTML = html.replace('Nhận việc', 'Accept Job');
                }
                if (html.includes('Xóa')) {
                    btn.innerHTML = html.replace('Xóa', 'Delete');
                }
            } else {
                if (html.includes('Accept Job')) {
                    btn.innerHTML = html.replace('Accept Job', 'Nhận việc');
                }
                if (html.includes('Delete')) {
                    btn.innerHTML = html.replace('Delete', 'Xóa');
                }
            }
        });
    }

    // Tạo nút bấm đổi ngôn ngữ nổi bật nếu chưa có
    function injectButton() {
        if (document.getElementById('myCustomLangBtn')) return;
        
        const headerContainer = document.querySelector('header .max-w-4xl');
        if (headerContainer) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex justify-end mb-2 px-2';
            const lang = localStorage.getItem('app_language') || 'vi';
            wrapper.innerHTML = `
                <button type="button" id="myCustomLangBtn" style="cursor: pointer; z-index: 9999; position: relative;" class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md">
                    <i class="fa-solid fa-globe"></i> 
                    <span id="myLangToggleText">${lang === 'vi' ? 'EN (English)' : 'VN (Tiếng Việt)'}</span>
                </button>
            `;
            headerContainer.parentElement.insertBefore(wrapper, headerContainer.nextSibling);

            // Bắt sự kiện bằng cả click và touchstart để đảm bảo nhạy trên iPad
            const btn = document.getElementById('myCustomLangBtn');
            const handleToggle = (e) => {
                e.preventDefault();
                e.stopPropagation();
                let current = localStorage.getItem('app_language') || 'vi';
                let next = current === 'vi' ? 'en' : 'vi';
                localStorage.setItem('app_language', next);
                applyTranslations();
            };

            btn.addEventListener('click', handleToggle);
            btn.addEventListener('touchstart', handleToggle);
        }
    }

    // Chạy định kỳ để tự động bắt các bài đăng mới load từ Supabase
    setInterval(() => {
        injectButton();
        applyTranslations();
    }, 500);

    // Kích hoạt ngay khi DOM sẵn sàng
    document.addEventListener('DOMContentLoaded', () => {
        injectButton();
        applyTranslations();
    });
})();