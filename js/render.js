import { Storage } from './storage.js';
import { JobService } from './job-service.js';
import { OrgService } from './org-service.js';
import { showToast } from './toast.js';

/**
 * 1. Hàm cập nhật giao diện xác thực người dùng (Auth UI)
 */
export function updateAuthUI() {
    const user = Storage.getUser();
    
    // Tìm các phần tử hiển thị thông tin người dùng trên Header / UI
    const btnRegisterPersonal = document.getElementById('btnRegisterPersonal'); // Nút "Đăng ký cá nhân"
    const userInfoContainer = document.getElementById('userInfoContainer'); // Khu vực hiển thị tên user sau khi đăng nhập
    const userNameEl = document.getElementById('userNameDisplay');

    if (user) {
        // Nếu ĐÃ ĐĂNG NHẬP: Ẩn nút đăng ký, hiện thông tin cá nhân
        if (btnRegisterPersonal) btnRegisterPersonal.classList.add('hidden');
        
        if (userInfoContainer) {
            userInfoContainer.classList.remove('hidden');
            if (userNameEl) userNameEl.textContent = `Xin chào, ${user.name || user.phone}`;
        }
    } else {
        // Nếu CHƯA ĐĂNG NHẬP: Hiện lại nút đăng ký
        if (btnRegisterPersonal) btnRegisterPersonal.classList.remove('hidden');
        if (userInfoContainer) userInfoContainer.classList.add('hidden');
    }
}

// Gắn hàm updateAuthUI vào window để các module khác dễ dàng gọi trực tiếp
window.updateAuthUI = updateAuthUI;

/**
 * 2. Hàm vẽ danh sách công việc (Jobs) - Tích hợp đầy đủ Nhận việc, Xóa, Thùng rác & Cloud
 */
export async function renderJobs() {
    // Hỗ trợ cả 2 ID container thường dùng ('jobList' hoặc 'jobListContainer')
    const container = document.getElementById('jobList') || document.getElementById('jobListContainer');
    if (!container) return;

    const jobs = await JobService.fetchCloudJobs();
    const deleted = Storage.getDeleted ? Storage.getDeleted() : [];
    const user = Storage.getUser(); // Lấy thông tin người đang đăng nhập

    // Lọc bỏ những việc đã bị đưa vào thùng rác
    const filtered = jobs.filter(j => !deleted.some(d => String(d.id) === String(j.id)));
    
    container.innerHTML = filtered.length === 0 
        ? `<p class="text-center text-slate-400 py-8">Không có việc phù hợp.</p>` 
        : '';

    filtered.forEach(job => {
        // Kiểm tra xem user hiện tại có phải là người đăng bài này không
        const isOwner = user && user.phone === job.phone;

        const jobCard = document.createElement('div');
        jobCard.className = "bg-white p-4 rounded-2xl border flex justify-between items-center shadow-sm mb-3";
        
        jobCard.innerHTML = `
            <div>
                <h3 class="font-bold text-slate-800 text-sm">${job.title || job.name}</h3>
                <p class="text-xs text-slate-500 mt-1">
                    📍 ${job.location || 'Chưa cập nhật'} &bull; 💰 <span class="font-semibold text-green-600">${job.salary || 'Thoả thuận'}</span>
                </p>
                <p class="text-xs text-slate-400 mt-0.5">Đăng bởi: ${job.poster || job.phone}</p>
            </div>
            <div class="flex gap-2 items-center">
                <!-- Nút Nhận việc -->
                <button data-id="${job.id}" class="btn-take bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer">
                    Nhận việc
                </button>

                <!-- Nút Xóa: CHỈ HIỂN THỊ KHI ĐÚNG LÀ CHÍNH CHỦ ĐĂNG -->
                ${isOwner ? `
                    <button data-id="${job.id}" class="btn-del px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition cursor-pointer">
                        <i class="fa-solid fa-trash-can"></i> Xóa
                    </button>
                ` : ''}
            </div>
        `;
        container.appendChild(jobCard);
    });

    // Gắn sự kiện tương tác trực tiếp cho danh sách hiện tại
    attachEventListeners(filtered);
}

/**
 * 3. Gắn sự kiện cho các nút Nhận việc & Xóa việc (Hỗ trợ cả Event Delegation chống trùng lặp)
 */
function attachEventListeners(filteredJobs) {
    // Sự kiện Nhận việc
    document.querySelectorAll('.btn-take').forEach(btn => {
        btn.onclick = async (e) => {
            const jobId = e.currentTarget.getAttribute('data-id');
            
            if (typeof JobService.takeJob === 'function') {
                await JobService.takeJob(jobId);
            } else {
                console.warn("Hàm takeJob chưa được định nghĩa trong JobService.");
            }
            
            // Reload lại giao diện sau khi thao tác
            renderJobs();
            if (typeof window.reloadJobs === 'function') {
                window.reloadJobs();
            }
        };
    });

    // Sự kiện Xóa việc (Chuyển vào thùng rác cục bộ & Xóa Cloud)
    document.querySelectorAll('.btn-del').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const target = filteredJobs.find(j => String(j.id) === String(id));
            
            if (target && confirm('Bạn có chắc chắn muốn chuyển bài đăng này vào thùng rác không?')) {
                // Đưa vào danh sách thùng rác Local Storage
                const delList = Storage.getDeleted ? Storage.getDeleted() : [];
                delList.unshift({ ...target, deletedAt: new Date().toLocaleString() });
                
                if (typeof Storage.saveDeleted === 'function') {
                    Storage.saveDeleted(delList);
                }

                // Xóa trên Cloud thông qua JobService (hỗ trợ cả deleteJob hoặc deleteCloudJob)
                if (typeof JobService.deleteJob === 'function') {
                    await JobService.deleteJob(id, target.phone);
                } else if (typeof JobService.deleteCloudJob === 'function') {
                    await JobService.deleteCloudJob(id, target.phone);
                }
                
                if (typeof showToast === 'function') {
                    showToast('Đã chuyển vào Thùng rác!');
                } else {
                    alert('Đã chuyển vào Thùng rác!');
                }

                // Cập nhật lại giao diện
                renderJobs();
                if (typeof window.reloadJobs === 'function') {
                    window.reloadJobs();
                }
            }
        };
    });
}

/**
 * 4. Hàm vẽ danh sách tổ chức/đơn vị (Organizations)
 */
export async function renderOrganizations() {
    const container = document.getElementById('orgList');
    if (!container) return;
    
    const orgs = OrgService && typeof OrgService.fetchCloudOrgs === 'function' 
        ? await OrgService.fetchCloudOrgs() 
        : [];

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = "flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x";

    orgs.forEach(o => {
        const card = document.createElement('div');
        card.className = "min-w-[280px] p-4 bg-white rounded-2xl border snap-start shadow-sm";
        card.innerHTML = `
            <h3 class="font-bold text-slate-800">${o.name}</h3>
            <p class="text-xs text-slate-500 mt-1">📍 ${o.address || 'Đang cập nhật'}</p>
        `;
        wrapper.appendChild(card);
    });
    container.appendChild(wrapper);
}