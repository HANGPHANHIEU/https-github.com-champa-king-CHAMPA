//Logic Đăng nhập / Đăng ký / Đổi mật khẩu( authentication-xác định)
export const AuthService = {
    login(phone, password) {
        const users = JSON.parse(localStorage.getItem('app_registered_users') || '[]');
        return users.find(u => u.phone === phone && u.password === password);
    },
    register(name, phone, password) {
        const users = JSON.parse(localStorage.getItem('app_registered_users') || '[]');
        if (users.some(u => u.phone === phone)) return false;
        const newUser = { id: Date.now(), name, phone, password };
        users.push(newUser);
        localStorage.setItem('app_registered_users', JSON.stringify(users));
        return newUser;
    }
};