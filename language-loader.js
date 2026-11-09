// BỘ TỪ ĐIỂN SONG NGỮ VIỆT - ANH TOÀN DIỆN
const i18nDict = {
    vi: {
        appTitle: "Việc Gấp",
        appSubTitle: "Kết nối lao động nhanh chóng",
        commissionText: "Hoa hồng 1%",
        manageWorkersText: "Quản lý nhận việc",
        authBtnText: "Đăng ký / Đăng nhập",
        heroBadge: "Cộng đồng uy tín Châu Thành & Toàn quốc",
        heroTitle: "Cần thợ gấp? Hoặc tìm việc làm ngay trong ngày?",
        heroDesc: "Nền tảng kết nối trực tiếp người cần thuê và người nhận việc an toàn, bảo mật và minh bạch.",
        postJobNow: "Đăng việc ngay",
        tabJobList: "Bảng tin việc làm",
        tabAcceptedJob: "Việc đã nhận",
        tabOrg: "Tổ chức/Đối tác",
        tabWorker: "Hồ sơ thợ",
        filterLoc: "Lọc nhanh theo khu vực:",
        allLoc: "Tất cả khu vực",
        btnAcceptJob: "Nhận việc",
        deleteBtn: "Xóa"
    },
    en: {
        appTitle: "Quick Jobs",
        appSubTitle: "Fast Labor Connection",
        commissionText: "1% Commission",
        manageWorkersText: "Manage Workers",
        authBtnText: "Register / Login",
        heroBadge: "Chau Thanh & Nationwide Community",
        heroTitle: "Need workers fast? Or looking for daily jobs?",
        heroDesc: "Direct platform connecting hirers and job seekers safely, securely, and transparently.",
        postJobNow: "Post Job Now",
        tabJobList: "Job Feed",
        tabAcceptedJob: "Accepted Jobs",
        tabOrg: "Organizations",
        tabWorker: "Workers Profile",
        filterLoc: "Filter by location:",
        allLoc: "All Locations",
        btnAcceptJob: "Accept Job",
        deleteBtn: "Delete"
    }
};

(function() {
    let currentLang = localStorage.getItem('app_language') || 'vi';

    // 1. Hàm thực thi dịch chữ trực tiếp lên giao diện
    function executeTranslation(lang) {
        currentLang = lang;
        localStorage.setItem('app_language', lang);

        // Đổi nhãn nút bấm trên Header
        const btnText = document.getElementById('activeLangText');
        if (btnText) {
            btnText.textContent = lang === 'vi' ? 'EN' : 'VN';
        }

        // Dịch các thẻ tĩnh chứa attribute data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18nDict[lang] && i18nDict[lang][key]) {
                el.textContent = i18nDict[lang][key];
            }
        });

        // Dịch các nút động "Nhận việc" và "Xóa" bên trong danh sách bài đăng (#jobList)
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

    // 2. Tự động thay thế nút EN tĩnh bằng nút tương tác thật
    function initLanguageWidget() {
        // Tìm chữ EN hoặc VN tĩnh đang bị kẹt trên header
        const headerElements = document.querySelectorAll('header span, header button, header div');
        let staticBtn = null;

        headerElements.forEach(el => {
            const txt = el.textContent.trim();
            if ((txt === 'EN' || txt === 'VN') && !el.id.includes('activeLangBtn')) {
                staticBtn = el;
            }
        });

        if (staticBtn) {
            const parent = staticBtn.parentElement;
            const newBtn = document.createElement('button');
            newBtn.type = 'button';
            newBtn.id = 'activeLangBtn';
            newBtn.className = 'bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-300 shadow-sm';
            newBtn.innerHTML = `<i class="fa-solid fa-globe text-teal-600"></i> <span id="activeLangText">${currentLang === 'vi' ? 'EN' : 'VN'}</span>`;
            
            parent.replaceChild(newBtn, staticBtn);

            // Bắt sự kiện Click trực tiếp
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const nextLang = currentLang === 'vi' ? 'en' : 'vi';
                executeTranslation(nextLang);
            });
        }
    }

    // Tự động kích hoạt khi DOM tải xong
    document.addEventListener('DOMContentLoaded', () => {
        initLanguageWidget();
        executeTranslation(currentLang);

        // Tự động quan sát #jobList: Khi Supabase render bài mới ra màn hình, tự dịch lại ngay
        const jobContainer = document.getElementById('jobList');
        if (jobContainer) {
            const observer = new MutationObserver(() => {
                executeTranslation(localStorage.getItem('app_language') || 'vi');
            });
            observer.observe(jobContainer, { childList: true, subtree: true });
        }
    });
})();