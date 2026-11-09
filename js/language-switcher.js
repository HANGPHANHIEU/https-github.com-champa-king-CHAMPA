// BỘ TỪ ĐIỂN SONG NGỮ (VIỆT - ANH) HOÀN CHỈNH CHO "VIỆC GẤP"
const translations = {
    vi: {
        appTitle: "Việc Gấp",
        appSubTitle: "Kết nối lao động nhanh chóng",
        commissionText: "Hoa hồng 1%",
        manageWorkersText: "Quản lý nhận việc",
        authBtnText: "Đăng ký / Đăng nhập",
        tabRegister: "1. Đăng ký tài khoản",
        tabLogin: "2. Đăng nhập",
        close: "Đóng",
        regNotice: "Mỗi số điện thoại chỉ được đăng ký 1 lần duy nhất. Nhận OTP qua Zalo hoặc WhatsApp.",
        phoneLabel: "Số điện thoại liên hệ *",
        otpLabel: "Mã xác thực OTP (6 chữ số) *",
        passLabel: "Tạo mật khẩu (Mặc định: 123456)",
        btnSendOtp: "Gửi mã xác thực qua Zalo / WhatsApp",
        btnConfirmReg: "Xác nhận Đăng ký & Đăng nhập ngay",
        loginPassLabel: "Mật khẩu truy cập",
        btnChangePass: "Đổi mật khẩu",
        btnForgotPass: "Quên mật khẩu? (Mã Zalo/WA)",
        btnConfirmLogin: "Xác nhận Đăng nhập",
        connectedPhone: "SĐT đang kết nối:",
        logout: "Đăng xuất",
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
        nationwide: "Toàn quốc",
        loadingJobs: "Đang tải danh sách công việc...",
        acceptedJobHeader: "Công việc do bạn nhận thực hiện",
        loginToViewAccepted: "Vui lòng đăng nhập để xem việc đã nhận.",
        orgHeader: "Danh sách Tổ chức / Đội nhóm uy tín",
        btnJoinOrg: "Ghi danh Tổ chức",
        workerHeader: "Danh sách thợ & nhân sự kỹ thuật",
        btnRegWorker: "Đăng ký Cá Nhân",
        trashTitle: "Thùng rác bài đăng",
        emptyTrash: "Thùng rác trống.",
        changePassTitle: "Đổi mật khẩu tài khoản",
        oldPassLabel: "Mật khẩu hiện tại *",
        newPassLabel: "Mật khẩu mới (tối thiểu 4 ký tự) *",
        confirmChangePass: "Xác nhận đổi mật khẩu",
        btnAcceptJob: "Nhận việc",
        deleteBtn: "Xóa"
    },
    en: {
        appTitle: "Quick Jobs",
        appSubTitle: "Fast Labor Connection",
        commissionText: "1% Commission",
        manageWorkersText: "Manage Workers",
        authBtnText: "Register / Login",
        tabRegister: "1. Register Account",
        tabLogin: "2. Login",
        close: "Close",
        regNotice: "Each phone number can only register once. Receive OTP via Zalo or WhatsApp.",
        phoneLabel: "Phone Number *",
        otpLabel: "OTP Code (6 digits) *",
        passLabel: "Create Password (Default: 123456)",
        btnSendOtp: "Send OTP via Zalo / WhatsApp",
        btnConfirmReg: "Confirm Register & Login",
        loginPassLabel: "Password",
        btnChangePass: "Change Password",
        btnForgotPass: "Forgot Password? (Zalo/WA)",
        btnConfirmLogin: "Confirm Login",
        connectedPhone: "Connected Phone:",
        logout: "Logout",
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
        nationwide: "Nationwide",
        loadingJobs: "Loading jobs list...",
        acceptedJobHeader: "Jobs Accepted By You",
        loginToViewAccepted: "Please login to view accepted jobs.",
        orgHeader: "Trusted Organizations & Teams",
        btnJoinOrg: "Register Org",
        workerHeader: "Workers & Skilled Personnel",
        btnRegWorker: "Register Profile",
        trashTitle: "Trash Posts",
        emptyTrash: "Trash is empty.",
        changePassTitle: "Change Password",
        oldPassLabel: "Current Password *",
        newPassLabel: "New Password (min 4 chars) *",
        confirmChangePass: "Confirm Change Password",
        btnAcceptJob: "Accept Job",
        deleteBtn: "Delete"
    }
};

window.currentLang = localStorage.getItem('app_language') || 'vi';

// HÀM ÁP DỤNG NGÔN NGỮ LÊN TOÀN BỘ TRANG
window.applyLanguage = function(lang) {
    if (lang) window.currentLang = lang;
    localStorage.setItem('app_language', window.currentLang);

    // Cập nhật nhãn trên tất cả các nút có hiển thị chữ EN / VN
    document.querySelectorAll('*').forEach(el => {
        if (el.childNodes.length === 1 && el.nodeType === Node.ELEMENT_NODE) {
            const text = el.textContent.trim();
            if (text === 'EN' || text === 'VN') {
                el.textContent = window.currentLang === 'vi' ? 'EN' : 'VN';
            }
        }
    });

    // 1. Dịch các thẻ có data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[window.currentLang] && translations[window.currentLang][key]) {
            el.textContent = translations[window.currentLang][key];
        }
    });

    // 2. Dịch các nút động trong danh sách công việc (#jobList)
    document.querySelectorAll('#jobList button').forEach(btn => {
        const text = btn.textContent;
        if (window.currentLang === 'en') {
            if (text.includes('Nhận việc')) {
                btn.innerHTML = `<span data-i18n="btnAcceptJob">Accept Job</span> &rarr;`;
            }
            if (text.includes('Xóa')) {
                btn.innerHTML = `<i class="fa-solid fa-trash-can mr-1"></i><span data-i18n="deleteBtn">Delete</span>`;
            }
        } else {
            if (text.includes('Accept Job')) {
                btn.innerHTML = `<span data-i18n="btnAcceptJob">Nhận việc</span> &rarr;`;
            }
            if (text.includes('Delete')) {
                btn.innerHTML = `<i class="fa-solid fa-trash-can mr-1"></i><span data-i18n="deleteBtn">Xóa</span>`;
            }
        }
    });
};

// HÀM CHUYỂN ĐỔI NGÔN NGỮ
window.toggleLanguage = function() {
    window.currentLang = window.currentLang === 'vi' ? 'en' : 'vi';
    window.applyLanguage(window.currentLang);
    if (typeof window.renderJobs === 'function') {
        window.renderJobs(window.currentSelectedLocation || 'ALL');
    }
};

// TỰ ĐỘNG GẮN SỰ KIỆN VÀO NÚT "EN" CÓ SẴN TRÊN HEADER KHI TẢI TRANG
document.addEventListener('DOMContentLoaded', () => {
    // Tìm bất kỳ phần tử nào đang chứa chữ "EN" hoặc "VN" trên header để biến nó thành nút bấm
    document.querySelectorAll('header button, header div, header span').forEach(el => {
        if (el.textContent.trim() === 'EN' || el.textContent.trim() === 'VN') {
            el.style.cursor = 'pointer';
            el.onclick = (e) => {
                e.preventDefault();
                window.toggleLanguage();
            };
        }
    });

    // Kích hoạt dịch ngay lập tức
    window.applyLanguage(window.currentLang);

    // Lắng nghe thay đổi DOM khi render bài đăng
    const jobListEl = document.getElementById('jobList');
    if (jobListEl) {
        const observer = new MutationObserver(() => {
            window.applyLanguage(window.currentLang);
        });
        observer.observe(jobListEl, { childList: true, subtree: true });
    }
});