// BỘ TỪ ĐIỂN SONG NGỮ (VIỆT - ANH)
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
        btnChangePass: "Đổi mật khẩu?",
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
        confirmChangePass: "Xác nhận đổi mật khẩu"
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
        btnChangePass: "Change Password?",
        btnForgotPass: "Forgot Password? (Zalo/WA)",
        btnConfirmLogin: "Confirm Login",
        connectedPhone: "Connected Phone:",
        logout: "Logout",
        heroBadge: "Chau Thanh & Nationwide Community",
        heroTitle: "Need workers fast? Or looking for daily jobs?",
    },
    en: {
        appTitle: "Quick Jobs",
        appSubTitle: "Fast Labor Connection",
        commissionText: "1% Commission",
        manageWorkersText: "Manage Workers",
        authBtnTest: "Register / Login",
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
        btnChangePass: "Change Password?",
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
        confirmChangePass: "Confirm Change Password"
    }
};

window.currentLang = localStorage.getItem('app_language') || 'vi';

// Hàm áp dụng ngôn ngữ
window.applyLanguage = function(lang) {
    window.currentLang = lang || window.currentLang;
    localStorage.setItem('app_language', window.currentLang);
    
    const btnText = document.getElementById('langBtnText');
    if (btnText) {
        btnText.textContent = window.currentLang === 'vi' ? 'EN' : 'VN';
    }
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[window.currentLang] && translations[window.currentLang][key]) {
            el.textContent = translations[window.currentLang][key];
        }
    });
};

// Hàm bấm chuyển đổi
window.toggleLanguage = function() {
    const nextLang = window.currentLang === 'vi' ? 'en' : 'vi';
    window.applyLanguage(nextLang);
};

// Tự động chèn nút bấm vào giao diện ngay khi trang tải xong mà không cần sửa index.html
document.addEventListener('DOMContentLoaded', () => {
    // Tìm vị trí container hoặc tạo tự động trên header nếu chưa có
    let container = document.getElementById('languageWidgetContainer');
    if (!container) {
        // Nếu trong index chưa có container, tự tạo và chèn vào đầu khu vực nút bấm trên Header
        const headerFlex = document.querySelector('header .max-w-4xl > div:last-child');
        if (headerFlex) {
            container = document.createElement('div');
            container.id = 'languageWidgetContainer';
            headerFlex.insertBefore(container, headerFlex.firstChild);
        }
    }

    if (container) {
        container.innerHTML = `
            <button type="button" onclick="window.toggleLanguage()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-300">
                <i class="fa-solid fa-globe text-teal-600"></i> <span id="langBtnText">EN</span>
            </button>
        `;
    }

    window.applyLanguage(window.currentLang);
});