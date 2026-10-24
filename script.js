function renderApprovalDashboard() {
            const workers = getWorkers();
            const orgs = getOrganizations();

            const pendingWorkers = workers.filter(w => w.status === 'pending' || !w.status);
            const pendingOrgs = orgs.filter(o => o.status === 'pending' || !o.status);

            if (statPendingWorkers) statPendingWorkers.textContent = pendingWorkers.length;
            if (statPendingOrgs) statPendingOrgs.textContent = pendingOrgs.length;

            // 1. Render Cá nhân chờ duyệt
            if (adminPendingWorkerList) {
                adminPendingWorkerList.innerHTML = '';
                if (pendingWorkers.length === 0) {
                    adminPendingWorkerList.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">Không có hồ sơ cá nhân nào đang chờ duyệt.</p>`;
                } else {
                    pendingWorkers.forEach(w => {
                        const div = document.createElement('div');
                        div.className = 'p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs';
                        div.innerHTML = `
                            <div>
                                <h4 class="font-bold text-slate-800 text-sm">${w.name} - <span class="text-amber-600">${w.skill}</span></h4>
                                <p class="text-slate-600 mt-0.5">📞 ${w.phone} &bull; 📍 ${w.location}</p>
                            </div>
                            <div class="flex gap-2">
                                <button data-id="${w.id}" class="btn-approve-worker px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-sm">Đồng ý</button>
                                <button data-id="${w.id}" class="btn-reject-worker px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition shadow-sm">Từ chối</button>
                            </div>`;
                        adminPendingWorkerList.appendChild(div);
                    });

                    // Gắn sự kiện cho nút Đồng ý cá nhân
                    document.querySelectorAll('.btn-approve-worker').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = Number(e.currentTarget.getAttribute('data-id'));
                            let workers = getWorkers();
                            workers = workers.map(w => w.id === id ? { ...w, status: 'approved' } : w);
                            localStorage.setItem('workers_list', JSON.stringify(workers));
                            renderApprovalDashboard();
                            alert('Đã phê duyệt hồ sơ cá nhân thành công!');
                        });
                    });

                    // Gắn sự kiện cho nút Từ chối cá nhân
                    document.querySelectorAll('.btn-reject-worker').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = Number(e.currentTarget.getAttribute('data-id'));
                            if (confirm('Bạn có chắc muốn từ chối và xóa hồ sơ này?')) {
                                let workers = getWorkers();
                                workers = workers.filter(w => w.id !== id);
                                localStorage.setItem('workers_list', JSON.stringify(workers));
                                renderApprovalDashboard();
                            }
                        });
                    });
                }
            }

            // 2. Render Tổ chức chờ duyệt
            if (adminPendingOrgList) {
                adminPendingOrgList.innerHTML = '';
                if (pendingOrgs.length === 0) {
                    adminPendingOrgList.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">Không có tổ chức nào đang chờ duyệt.</p>`;
                } else {
                    pendingOrgs.forEach(o => {
                        const div = document.createElement('div');
                        div.className = 'p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs';
                        div.innerHTML = `
                            <div>
                                <h4 class="font-bold text-slate-800 text-sm">${o.name}</h4>
                                <p class="text-slate-600 mt-0.5">📞 ${o.phone} &bull; 📍 ${o.location}</p>
                                <p class="text-blue-700 font-medium mt-0.5">Thế mạnh: ${o.strength}</p>
                            </div>
                            <div class="flex gap-2">
                                <button data-id="${o.id}" class="btn-approve-org px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-sm">Đồng ý</button>
                                <button data-id="${o.id}" class="btn-reject-org px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition shadow-sm">Từ chối</button>
                            </div>`;
                        adminPendingOrgList.appendChild(div);
                    });

                    // Gắn sự kiện cho nút Đồng ý tổ chức
                    document.querySelectorAll('.btn-approve-org').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = Number(e.currentTarget.getAttribute('data-id'));
                            let orgs = getOrganizations();
                            orgs = orgs.map(o => o.id === id ? { ...o, status: 'approved' } : o);
                            localStorage.setItem('organizations_list', JSON.stringify(orgs));
                            renderApprovalDashboard();
                            alert('Đã phê duyệt tổ chức thành công!');
                        });
                    });

                    // Gắn sự kiện cho nút Từ chối tổ chức
                    document.querySelectorAll('.btn-reject-org').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = Number(e.currentTarget.getAttribute('data-id'));
                            if (confirm('Bạn có chắc muốn từ chối tổ chức này?')) {
                                let orgs = getOrganizations();
                                orgs = orgs.filter(o => o.id !== id);
                                localStorage.setItem('organizations_list', JSON.stringify(orgs));
                                renderApprovalDashboard();
                            }
                        });
                    });
                }
            }
        }