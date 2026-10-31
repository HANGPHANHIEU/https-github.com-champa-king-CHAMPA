//Giao diện Modal Đăng nhập( hiển thị cửa sổ đè lên trên)
import { Storage } from './storage.js';
import { AuthService } from './auth-service.js';
import { showToast } from './toast.js';

export function initAuthModal(onAuthChange) {
    if (!document.getElementById('authModal')) {
        const div = document.createElement('div');
        div.innerHTML = `
            <div id="authModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm hidden items-center justify-center z-50 p-4">
                <div class="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4 relative">
                    <button id="btnCloseAuthModal" class="absolute top-4 right-4 text-slate-400 text-xl font-bold">&times;</button>
                    <h2 class="text-lg font-bold text-center">Đăng nhập tài khoản</h2>
                    <form id="loginForm" class="space-y-3">
                        <input type="tel" id="loginPhoneInput" required placeholder="Số điện thoại" class="w-full px-3 py-2 border rounded-xl text-sm">
                        <input type="password" id="loginPasswordInput" required placeholder="Mật khẩu" class="w-full px-3 py-2 border rounded-xl text-sm">
                        <button type="submit" class="w-full py-2.5 bg-[#0d9488] text-white font-medium rounded-xl text-sm">Đăng nhập</button>
                    </form>
                </div>
            </div>`;
        document.body.appendChild(div);
    }

    const modal = document.getElementById('authModal');
    document.getElementById('btnCloseAuthModal')?.addEventListener('click', () => modal.classList.add('hidden'));

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = AuthService.login(document.getElementById('loginPhoneInput').value.trim(), document.getElementById('loginPasswordInput').value.trim());
        if (user) {
            Storage.setUser(user);
            modal.classList.add('hidden');
            showToast(`Xin chào ${user.name}!`);
            onAuthChange();
        } else { alert('Thông tin không chính xác!'); }
    });
}