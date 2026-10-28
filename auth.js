// --- QUẢN LÝ THÀNH VIÊN VÀ ĐĂNG NHẬP ---
//authentication(xác thực)
// Lấy danh sách thành viên
function getUsers() {
    try {
        const saved = localStorage.getItem('app_users');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
}

// Đăng ký tài khoản mới
function registerUser(name, phone, password) {
    const users = getUsers();
    if (users.some(u => u.phone === phone)) {
        return { success: false, message: 'Số điện thoại này đã được đăng ký!' };
    }

    const newUser = { id: Date.now(), name, phone, password };
    users.push(newUser);
    localStorage.setItem('app_users', JSON.stringify(users));
    
    // Tự động đăng nhập sau khi đăng ký thành công
    setCurrentUser(newUser);
    return { success: true, message: 'Đăng ký thành công!' };
}

// Đăng nhập
function loginUser(phone, password) {
    const users = getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    if (!user) {
        return { success: false, message: 'Số điện thoại hoặc mật khẩu không chính xác!' };
    }
    setCurrentUser(user);
    return { success: true, message: 'Đăng nhập thành công!' };
}

// Lưu thông tin người dùng hiện tại
function setCurrentUser(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
}

// Lấy thông tin người dùng đang đăng nhập
function getCurrentUser() {
    try {
        const saved = localStorage.getItem('current_user');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
}

// Đăng xuất
function logoutUser() {
    localStorage.removeItem('current_user');
}