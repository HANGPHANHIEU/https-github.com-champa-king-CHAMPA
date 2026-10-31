//Giao diện Modal Tổ chức / Cá nhân
import { Storage } from './storage.js';
import { OrgService } from './org-service.js';
import { showToast } from './toast.js';

export function initOrgModals(onUpdated) {
    const workerModal = document.getElementById('workerModal');
    const orgModal = document.getElementById('orgModal');

    document.getElementById('btnRegisterWorker')?.addEventListener('click', () => {
        const u = Storage.getUser();
        if (!u) return showToast('Vui lòng đăng nhập!', 'error');
        document.getElementById('workerNameInput').value = u.name || '';
        document.getElementById('workerPhoneInput').value = u.phone || '';
        workerModal?.classList.remove('hidden');
    });

    document.getElementById('workerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        Storage.saveWorker({
            id: Date.now(),
            name: document.getElementById('workerNameInput').value.trim(),
            phone: document.getElementById('workerPhoneInput').value.trim(),
            location: document.getElementById('workerLocationInput').value,
            skill: document.getElementById('workerSkillInput').value.trim(),
            status: 'approved'
        });
        workerModal?.classList.add('hidden');
        showToast('Đăng ký thành công!');
        onUpdated();
    });

    document.getElementById('btnJoinOrg')?.addEventListener('click', () => {
        const u = Storage.getUser();
        if (!u) return showToast('Vui lòng đăng nhập!', 'error');
        document.getElementById('orgPhoneInput').value = u.phone || '';
        orgModal?.classList.remove('hidden');
    });

    document.getElementById('orgForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await OrgService.createCloudOrg({
            name: document.getElementById('orgNameInput').value.trim(),
            phone: document.getElementById('orgPhoneInput').value.trim(),
            province: document.getElementById('orgProvinceInput').value,
            district: document.getElementById('orgDistrictInput').value.trim(),
            address: document.getElementById('orgAddressInput').value.trim(),
            strength: document.getElementById('orgStrengthInput').value.trim(),
            status: 'approved'
        });
        orgModal?.classList.add('hidden');
        showToast('Ghi danh thành công!');
        onUpdated();
    });
}