// --- HÀM TẢI VÀ HIỂN THỊ DỮ LIỆU CHỜ DUYỆT (SỬ DỤNG STORAGE) ---
    async function loadPendingData() {
        // Lấy danh sách thông qua Storage
        let workers = Storage.getWorkers();
        let orgs = Storage.getOrgs();

        // Lọc các hồ sơ ở trạng thái 'pending' hoặc chưa có status
        const pendingWorkers = workers.filter(w => w && (w.status === 'pending' || !w.status));
        const pendingOrgs = orgs.filter(o => o && (o.status === 'pending' || !o.status));

        // Cập nhật số lượng hiển thị trên Badge
        const statPendingWorkers = document.getElementById('statPendingWorkers');
        const statPendingOrgs = document.getElementById('statPendingOrgs');
        if (statPendingWorkers) statPendingWorkers.textContent = pendingWorkers.length;
        if (statPendingOrgs) statPendingOrgs.textContent = pendingOrgs.length;

        // Render danh sách Cá nhân chờ duyệt
        const workerContainer = document.getElementById('adminPendingWorkerList');
        if (workerContainer) {
            workerContainer.innerHTML = '';
            if (pendingWorkers.length === 0) {
                workerContainer.innerHTML = `<p class="text-xs text-slate-400 text-center py-3">Không có hồ sơ cá nhân nào đang chờ duyệt.</p>`;
            } else {
                pendingWorkers.forEach(w => {
                    const item = document.createElement('div');
                    item.className = 'p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs mb-2';
                    item.innerHTML = `
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm">${w.name || 'Chưa có tên'} - <span class="text-amber-600">${w.skill || w.category || 'Cá nhân'}</span></h4>
                            <p class="text-slate-600 mt-0.5">📞 ${w.phone || 'N/A'} &bull; 📍 ${w.location || 'Chưa cập nhật'}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.approveWorker('${w.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer">Đồng ý</button>
                            <button onclick="window.rejectWorker('${w.id}')" class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition cursor-pointer">Từ chối</button>
                        </div>
                    `;
                    workerContainer.appendChild(item);
                });
            }
        }

        // Render danh sách Tổ chức chờ duyệt
        const orgContainer = document.getElementById('adminPendingOrgList');
        if (orgContainer) {
            orgContainer.innerHTML = '';
            if (pendingOrgs.length === 0) {
                orgContainer.innerHTML = `<p class="text-xs text-slate-400 text-center py-3">Không có tổ chức nào đang chờ duyệt.</p>`;
            } else {
                pendingOrgs.forEach(o => {
                    const item = document.createElement('div');
                    item.className = 'p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs mb-2';
                    item.innerHTML = `
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm">${o.name || 'Chưa có tên tổ chức'}</h4>
                            <p class="text-slate-600 mt-0.5">📞 ${o.phone || 'N/A'} &bull; 📍 ${o.district || o.province || o.address || ''}</p>
                            <p class="text-blue-700 font-medium mt-0.5">Thế mạnh: ${o.strength || 'Chưa cập nhật'}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.approveOrg('${o.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer">Đồng ý</button>
                            <button onclick="window.rejectOrg('${o.id}')" class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition cursor-pointer">Từ chối</button>
                        </div>
                    `;
                    orgContainer.appendChild(item);
                });
            }
        }
    }

    // --- CÁC HÀM XỬ LÝ PHÊ DUYỆT / TỪ CHỐI GỌN GÀNG QUA STORAGE ---
    window.approveOrg = function(id) {
        Storage.updateOrgStatus(id, 'approved');
        alert("Đã phê duyệt tổ chức thành công!");
        loadPendingData();
    };

    window.rejectOrg = function(id) {
        if (confirm("Bạn có chắc chắn muốn từ chối và xóa hồ sơ tổ chức này?")) {
            Storage.deleteOrg(id);
            loadPendingData();
        }
    };

    window.approveWorker = function(id) {
        Storage.updateWorkerStatus(id, 'approved');
        alert("Đã phê duyệt hồ sơ cá nhân thành công!");
        loadPendingData();
    };

    window.rejectWorker = function(id) {
        if (confirm("Bạn có chắc chắn muốn từ chối và xóa hồ sơ cá nhân này?")) {
            Storage.deleteWorker(id);
            loadPendingData();
        }
    };