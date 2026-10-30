// ==========================================
// MODULE QUẢN LÝ XÁC THỰC THÀNH VIÊN (AUTH.JS)
// ==========================================

// Lấy danh sách tài khoản đã đăng ký từ localStorage
function getUsers() {
    try {
        const saved = localStorage.getItem('app_users');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
}

// Đăng ký tài khoản thành viên mới
function registerUser(name, phone, password) {
    const users = getUsers();
    
    // Kiểm tra trùng số điện thoại
    if (users.some(u => u.phone === phone)) {
        return { success: false, message: 'Số điện thoại này đã được đăng ký!' };
    }

    const newUser = {
        id: Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        password: password.trim(),
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('app_users', JSON.stringify(users));
    
    // Tự động đăng nhập người dùng mới đăng ký
    setCurrentUser(newUser);
    return { success: true, message: 'Đăng ký tài khoản thành công!' };
}

// Đăng nhập tài khoản
function loginUser(phone, password) {
    const users = getUsers();
    const user = users.find(u => u.phone === phone.trim() && u.password === password.trim());

    if (!user) {
        return { success: false, message: 'Số điện thoại hoặc mật khẩu không chính xác!' };
    }

    setCurrentUser(user);
    return { success: true, message: 'Đăng nhập thành công!' };
}

// Lưu thông tin phiên đăng nhập
function setCurrentUser(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
}

// Lấy thông tin tài khoản đang đăng nhập
function getCurrentUser() {
    try {
        const saved = localStorage.getItem('current_user');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
}

// Đăng xuất tài khoản
function logoutUser() {
    localStorage.removeItem('current_user');
}