// BỘ TỪ ĐIỂN SONG NGỮ VIỆT - ANH (KHÔNG PHỤ THUỘC NÚT CŨ)
const i18nDict = {
    vi: {
        btnAcceptJob: "Nhận việc",
        deleteBtn: "Xóa"
    },
    en: {
        btnAcceptJob: "Accept Job",
        deleteBtn: "Delete"
    }
};

(function() {
    let currentLang = localStorage.getItem('app_language') || 'vi';

    function runTranslation(lang) {
        currentLang = lang;
        localStorage.setItem('app_language', lang);

        // Đổi chữ trên nút bấm mới của chúng ta
        const toggleBtnText = document.getElementById('myLangToggleText');
        if (toggleBtnText) {
            toggleBtnText.textContent = lang === 'vi' ? 'EN (Tiếng Anh)' : 'VN (Tiếng Việt)';
        }

        // Dịch các nút Nhận việc / Xóa trong danh sách bài đăng
        document.querySelectorAll('#jobList button').forEach(btn => {
            const html = btn.innerHTML;
            if (lang === 'en') {
                if (html.includes('Nhận việc')) btn.innerHTML = html.replace('Nhận việc', 'Accept Job');
                if (html.includes('Xóa')) btn.innerHTML = html.replace('Xóa', 'Delete');
            } else {
                if (html.includes('Accept Job')) btn.innerHTML = html.replace('Accept Job', 'Nhận việc');
                if (html.includes('Delete')) btn.innerHTML = html.replace('Delete', 'Xóa');
            }
        });
    }

    // Tự động tạo một nút bấm đổi ngôn ngữ nổi bật đè lên góc phải header
    document.addEventListener('DOMContentLoaded', () => {
        const headerContainer = document.querySelector('header .max-w-4xl');
        if (headerContainer && !document.getElementById('myCustomLangBtn')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex justify-end mb-2';
            wrapper.innerHTML = `
                <button type="button" id="myCustomLangBtn" class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md">
                    <i class="fa-solid fa-globe"></i> 
                    <span id="myLangToggleText">${currentLang === 'vi' ? 'EN (Tiếng Anh)' : 'VN (Tiếng Việt)'}</span>
                </button>
            `;
            // Chèn ngay dưới header
            headerContainer.parentElement.insertBefore(wrapper, headerContainer.nextSibling);

            // Bắt sự kiện click chắc chắn 100% ăn ngay trên thiết bị cảm ứng
            document.getElementById('myCustomLangBtn').addEventListener('click', (e) => {
                e.preventDefault();
                const nextLang = currentLang === 'vi' ? 'en' : 'vi';
                runTranslation(nextLang);
            });
        }

        runTranslation(currentLang);

        // Tự động quét lại khi có bài viết mới từ Supabase
        const jobContainer = document.getElementById('jobList');
        if (jobContainer) {
            const observer = new MutationObserver(() => {
                runTranslation(localStorage.getItem('app_language') || 'vi');
            });
            observer.observe(jobContainer, { childList: true, subtree: true });
        }
    });
})();