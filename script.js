document.addEventListener('DOMContentLoaded', () => {

    // --- 1. QUẢN LÝ TÀI KHOẢN & PHIÊN ĐĂNG NHẬP (AUTH) ---
    window.getCurrentUser = function() {
        try {
            const user = localStorage.getItem('current_logged_user');
            return user ? JSON.parse(user) : null;
        } catch (e) {
            return null;
        }
    };

    window.setCurrentUser = function(user) {
        if (user) {
            localStorage.setItem('current_logged_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('current_logged_user');
        }
        updateAuthButtonUI();
        renderJobs();
        renderAcceptedJobs();
    };

    // Tự động tạo Modal Đăng nhập / Đăng ký nếu chưa có trong HTML
    if (!document.getElementById('authModal')) {
        const authContainer = document.createElement('div');
        authContainer.id = 'authModalContainer';
        authContainer.innerHTML = `
            <div id="authModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm hidden items-center justify-center z-50 p-4">
                <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4 relative">
                    <button id="btnCloseAuthModal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
                    
                    <div class="text-center space-y-1">
                        <div class="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-xl mx-auto mb-1">
                            <i class="fa-solid fa-user-gear"></i>
                        </div>
                        <h2 id="authTitle" class="text-lg font-bold text-slate-900">Đăng nhập tài khoản</h2>
                        <p class="text-xs text-slate-500">Đăng nhập để nhận việc, đăng việc & quản lý bài</p>
                    </div>

                    <!-- Form Đăng Nhập -->
                    <form id="loginForm" class="space-y-3">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                            <input type="tel" id="loginPhoneInput" required placeholder="0901234567" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
                            <input type="password" id="loginPasswordInput" required placeholder="••••••••" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600">
                        </div>
                        <button type="submit" class="w-full py-2.5 bg-[#0d9488] hover:bg-teal-700 text-white font-medium rounded-xl transition text-sm shadow-sm">
                            Đăng nhập
                        </button>
                        <p class="text-xs text-center text-slate-500 pt-1">
                            Chưa có tài khoản? <a href="#" id="switchToRegister" class="text-teal-600 font-bold hover:underline">Đăng ký ngay</a>
                        </p>
                    </form>

                    <!-- Form Đăng Ký -->
                    <form id="registerForm" class="space-y-3 hidden">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
                            <input type="text" id="regNameInput" required placeholder="Nguyễn Văn A" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                            <input type="tel" id="regPhoneInput" required placeholder="0901234567" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
                            <input type="password" id="regPasswordInput" required placeholder="••••••••" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600">
                        </div>
                        <button type="submit" class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition text-sm shadow-sm">
                            Tạo tài khoản mới
                        </button>
                        <p class="text-xs text-center text-slate-500 pt-1">
                            Đã có tài khoản? <a href="#" id="switchToLogin" class="text-teal-600 font-bold hover:underline">Đăng nhập</a>
                        </p>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(authContainer);
    }

    function updateAuthButtonUI() {
        const btnLoginAccount = document.getElementById('btnLoginAccount');
        const loginBtnText = document.getElementById('loginBtnText');
        const currentUser = getCurrentUser();

        if (btnLoginAccount && loginBtnText) {
            if (currentUser) {
                loginBtnText.textContent = currentUser.name.split(' ').pop();
                btnLoginAccount.title = `Đang đăng nhập: ${currentUser.name}\nBấm để đăng xuất`;
                btnLoginAccount.className = "bg-teal-50 text-teal-700 border border-teal-200 font-medium px-3 py-2 rounded-xl text-xs flex items-center transition shadow-sm";
            } else {
                loginBtnText.textContent = "Đăng nhập";
                btnLoginAccount.title = "Đăng nhập tài khoản";
                btnLoginAccount.className = "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2 rounded-xl text-xs flex items-center transition shadow-sm";
            }
        }
    }

    const btnLoginAccount = document.getElementById('btnLoginAccount');
    const authModal = document.getElementById('authModal');
    const btnCloseAuthModal = document.getElementById('btnCloseAuthModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    if (btnLoginAccount) {
        btnLoginAccount.addEventListener('click', (e) => {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (currentUser) {
                if (confirm(`Tài khoản: ${currentUser.name} (${currentUser.phone})\n\nBạn có muốn đăng xuất không?`)) {
                    setCurrentUser(null);
                    showToast('Đã đăng xuất tài khoản thành công.');
                }
            } else {
                authModal?.classList.remove('hidden');
                authModal?.classList.add('flex');
            }
        });
    }

    btnCloseAuthModal?.addEventListener('click', () => {
        authModal?.classList.add('hidden');
        authModal?.classList.remove('flex');
    });

    switchToRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm?.classList.add('hidden');
        registerForm?.classList.remove('hidden');
        if (authTitle) authTitle.textContent = 'Đăng ký tài khoản mới';
    });

    switchToLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm?.classList.add('hidden');
        loginForm?.classList.remove('hidden');
        if (authTitle) authTitle.textContent = 'Đăng nhập tài khoản';
    });

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('loginPhoneInput').value.trim();
        const pass = document.getElementById('loginPasswordInput').value.trim();

        const users = JSON.parse(localStorage.getItem('app_registered_users') || '[]');
        const found = users.find(u => u.phone === phone && u.password === pass);

        if (found) {
            setCurrentUser(found);
            authModal?.classList.add('hidden');
            authModal?.classList.remove('flex');
            loginForm.reset();
            showToast(`Xin chào ${found.name}! Đăng nhập thành công.`);
        } else {
            alert('Số điện thoại hoặc mật khẩu không chính xác!');
        }
    });

    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regNameInput').value.trim();
        const phone = document.getElementById('regPhoneInput').value.trim();
        const password = document.getElementById('regPasswordInput').value.trim();

        const users = JSON.parse(localStorage.getItem('app_registered_users') || '[]');
        if (users.some(u => u.phone === phone)) {
            alert('Số điện thoại này đã được đăng ký thành viên!');
            return;
        }

        const newUser = { id: Date.now(), name, phone, password };
        users.push(newUser);
        localStorage.setItem('app_registered_users', JSON.stringify(users));

        setCurrentUser(newUser);
        authModal?.classList.add('hidden');
        authModal?.classList.remove('flex');
        registerForm.reset();
        showToast('Đăng ký tài khoản thành công!');
    });


    // --- 2. HỆ THỐNG ĐIỀU HƯỚNG TAB ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(targetTabId) {
        tabContents.forEach(tab => {
            if (tab.id === targetTabId) {
                tab.classList.remove('hidden');
            } else {
                tab.classList.add('hidden');
            }
        });

        navButtons.forEach(btn => {
            const btnTab = btn.getAttribute('data-tab');
            if (btnTab === targetTabId) {
                btn.classList.add('text-[#0d9488]');
                btn.classList.remove('text-slate-400');
            } else {
                btn.classList.remove('text-[#0d9488]');
                btn.classList.add('text-slate-400');
            }
        });

        if (targetTabId === 'tabAcceptedJob') renderAcceptedJobs();
        if (targetTabId === 'tabOrganization') renderOrganizations();
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        });
    });


    // --- 3. QUẢN LÝ HỒ SƠ CÁ NHÂN & TỔ CHỨC ---
    const workerModal = document.getElementById('workerModal');
    const btnRegisterWorker = document.getElementById('btnRegisterWorker');
    const btnCloseWorkerModal = document.getElementById('btnCloseWorkerModal');
    const btnCancelWorkerModal = document.getElementById('btnCancelWorkerModal');
    const workerForm = document.getElementById('workerForm');

    function getWorkers() {
        try {
            const saved = localStorage.getItem('workers_list');
            return saved ? JSON.parse(saved) : [
                { id: 1, name: 'Trần Văn Bình', phone: '0988123456', location: 'Châu Thành', skill: 'Giao hàng hỏa tốc, Tài xế công nghệ', status: 'approved' }
            ];
        } catch (e) { return []; }
    }

    function saveWorker(newWorker) {
        const workers = getWorkers();
        workers.unshift(newWorker);
        localStorage.setItem('workers_list', JSON.stringify(workers));
    }

    if (btnRegisterWorker) {
        btnRegisterWorker.addEventListener('click', () => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Vui lòng đăng ký hoặc đăng nhập tài khoản trước!', 'error');
                authModal?.classList.remove('hidden');
                authModal?.classList.add('flex');
                return;
            }

            const nameInput = document.getElementById('workerNameInput');
            const phoneInput = document.getElementById('workerPhoneInput');
            if (nameInput) nameInput.value = currentUser.name || '';
            if (phoneInput) phoneInput.value = currentUser.phone || '';

            workerModal?.classList.remove('hidden');
            workerModal?.classList.add('flex');
        });
    }

    function closeWorkerModal() {
        workerModal?.classList.add('hidden');
        workerModal?.classList.remove('flex');
    }

    btnCloseWorkerModal?.addEventListener('click', closeWorkerModal);
    btnCancelWorkerModal?.addEventListener('click', closeWorkerModal);

    workerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newWorker = {
            id: Date.now(),
            name: document.getElementById('workerNameInput').value.trim(),
            phone: document.getElementById('workerPhoneInput').value.trim(),
            location: document.getElementById('workerLocationInput').value,
            skill: document.getElementById('workerSkillInput').value.trim(),
            status: 'approved'
        };

        if (!newWorker.name || !newWorker.phone || !newWorker.skill) {
            showToast('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        saveWorker(newWorker);
        closeWorkerModal();
        workerForm.reset();
        showToast('Đăng ký hồ sơ cá nhân thành công!');
        renderOrganizations();
    });

    // Tổ chức / Đối tác
    const orgModal = document.getElementById('orgModal');
    const btnJoinOrg = document.getElementById('btnJoinOrg');
    const btnCloseOrgModal = document.getElementById('btnCloseOrgModal');
    const btnCancelOrgModal = document.getElementById('btnCancelOrgModal');
    const orgForm = document.getElementById('orgForm');

    function getOrganizations() {
        try {
            const saved = localStorage.getItem('organizations_list');
            return saved ? JSON.parse(saved) : [
                { id: 1, name: 'Hợp tác xã Vận tải Châu Thành', phone: '0903123456', province: 'An Giang', district: 'Châu Thành', ward: 'Xã Bình Hòa', address: 'Số 123 Quốc lộ 91', strength: 'Giao hàng hỏa tốc, Dịch vụ vận chuyển', status: 'approved' }
            ];
        } catch (e) { return []; }
    }

    function saveOrg(newOrg) {
        const orgs = getOrganizations();
        orgs.unshift(newOrg);
        localStorage.setItem('organizations_list', JSON.stringify(orgs));
    }

    if (btnJoinOrg) {
        btnJoinOrg.addEventListener('click', () => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Vui lòng đăng ký hoặc đăng nhập tài khoản trước!', 'error');
                authModal?.classList.remove('hidden');
                authModal?.classList.add('flex');
                return;
            }

            const phoneInput = document.getElementById('orgPhoneInput');
            if (phoneInput) phoneInput.value = currentUser.phone || '';

            orgModal?.classList.remove('hidden');
            orgModal?.classList.add('flex');
        });
    }

    function closeOrgModal() {
        orgModal?.classList.add('hidden');
        orgModal?.classList.remove('flex');
    }

    btnCloseOrgModal?.addEventListener('click', closeOrgModal);
    btnCancelOrgModal?.addEventListener('click', closeOrgModal);

    orgForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newOrg = {
            id: Date.now(),
            name: document.getElementById('orgNameInput').value.trim(),
            phone: document.getElementById('orgPhoneInput').value.trim(),
            province: document.getElementById('orgProvinceInput').value,
            district: document.getElementById('orgDistrictInput').value.trim(),
            ward: document.getElementById('orgWardInput').value.trim(),
            address: document.getElementById('orgAddressInput').value.trim(),
            strength: document.getElementById('orgStrengthInput').value.trim(),
            status: 'approved'
        };

        if (!newOrg.name || !newOrg.phone || !newOrg.district || !newOrg.address || !newOrg.strength) {
            showToast('Vui lòng điền đầy đủ thông tin tổ chức!', 'error');
            return;
        }

        saveOrg(newOrg);
        closeOrgModal();
        orgForm.reset();
        showToast('Ghi danh tổ chức thành công!');
        renderOrganizations();
    });

    // Render Tab Tổ chức (Có lọc theo Quận/Huyện)
    function renderOrganizations() {
        const orgListContainer = document.getElementById('orgList');
        if (!orgListContainer) return;

        const selectedDistrict = document.getElementById('filterOrgDistrict')?.value || '';
        const orgs = getOrganizations().filter(o => {
            const matchStatus = o.status === 'approved';
            const matchDist = !selectedDistrict || (o.district && o.district.toLowerCase().includes(selectedDistrict.toLowerCase()));
            return matchStatus && matchDist;
        });

        const workers = getWorkers().filter(w => {
            const matchStatus = w.status === 'approved';
            const matchDist = !selectedDistrict || (w.location && w.location.toLowerCase().includes(selectedDistrict.toLowerCase()));
            return matchStatus && matchDist;
        });

        orgListContainer.innerHTML = '';

        if (orgs.length === 0 && workers.length === 0) {
            orgListContainer.innerHTML = `
                <div class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p class="text-slate-400 text-sm">Chưa có tổ chức hoặc cá nhân nào tại khu vực này.</p>
                </div>`;
            return;
        }

        orgs.forEach(org => {
            const card = document.createElement('div');
            card.className = "p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2";
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <span class="px-2 py-0.5 text-[10px] bg-blue-100 text-blue-700 font-bold rounded-md">
                            ${org.ward ? `${org.ward}, ` : ''}${org.district || ''} - ${org.province || 'An Giang'}
                        </span>
                        <h3 class="font-bold text-slate-800 text-base mt-1">${org.name}</h3>
                    </div>
                    <a href="tel:${org.phone}" class="px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"><i class="fa-solid fa-phone"></i> Gọi ngay</a>
                </div>
                <p class="text-xs text-slate-500">📍 Địa chỉ: ${org.address}</p>
                <p class="text-xs text-slate-700 font-medium">⚡ Thế mạnh: ${org.strength}</p>
            `;
            orgListContainer.appendChild(card);
        });

        workers.forEach(w => {
            const card = document.createElement('div');
            card.className = "p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2";
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <span class="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-700 font-bold rounded-md">CÁ NHÂN ĐỐI TÁC</span>
                        <h3 class="font-bold text-slate-800 text-base mt-1">${w.name}</h3>
                    </div>
                    <a href="tel:${w.phone}" class="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"><i class="fa-solid fa-phone"></i> Liên hệ</a>
                </div>
                <p class="text-xs text-slate-500">📍 Khu vực: ${w.location}</p>
                <p class="text-xs text-slate-700 font-medium">🛠️ Sở trường: ${w.skill}</p>
            `;
            orgListContainer.appendChild(card);
        });
    }

    const filterOrgDistrict = document.getElementById('filterOrgDistrict');
    if (filterOrgDistrict) {
        filterOrgDistrict.addEventListener('change', renderOrganizations);
    }


    // --- 4. QUẢN LÝ VIỆC LÀM & NHẬN VIỆC ---
    const defaultJobs = [
        { id: 1, title: 'Giao hàng hỏa tốc tại Châu Thành', phone: '0901112223', location: 'Châu Thành', category: 'delivery', salary: '180.000đ / chuyến', isUrgent: true, createdByName: 'Nguyễn Văn A', createdBy: '0901112223' },
        { id: 2, title: 'Dọn dẹp nhà cửa tại Long Xuyên', phone: '0904445556', location: 'Long Xuyên', category: 'cleaning', salary: '300.000đ / buổi', isUrgent: false, createdByName: 'Trần Thị B', createdBy: '0904445556' },
        { id: 3, title: 'Sửa đường ống nước tại nhà', phone: '0907778889', location: 'Châu Thành', category: 'repair', salary: '250.000đ', isUrgent: true, createdByName: 'Lê Văn C', createdBy: '0907778889' }
    ];

    function getJobs() {
        try {
            const saved = localStorage.getItem('my_jobs_list');
            return saved ? JSON.parse(saved) : defaultJobs;
        } catch (e) { return defaultJobs; }
    }

    function saveJob(newJob) {
        const jobs = getJobs();
        jobs.unshift(newJob);
        localStorage.setItem('my_jobs_list', JSON.stringify(jobs));
    }

    function deleteJob(jobId) {
        let jobs = getJobs();
        const targetJob = jobs.find(j => j.id === jobId);
        const currentUser = getCurrentUser();

        if (!targetJob) return;

        const isAdmin = localStorage.getItem('is_admin_logged') === 'true' || (currentUser && currentUser.role === 'admin');
        const isOwner = currentUser && targetJob.createdBy === currentUser.phone;

        if (!isAdmin && !isOwner) {
            alert('Bạn không có quyền xóa công việc này! Chỉ có Quản trị viên hoặc chính người đăng mới có quyền xóa.');
            return;
        }

        if (confirm(`Bạn có chắc muốn xóa công việc: "${targetJob.title}" không?`)) {
            jobs = jobs.filter(j => j.id !== jobId);
            localStorage.setItem('my_jobs_list', JSON.stringify(jobs));
            renderJobs();
            showToast('Đã xóa công việc thành công.');
        }
    }

    function getAcceptedJobs() {
        try {
            return JSON.parse(localStorage.getItem('accepted_jobs_list') || '[]');
        } catch (e) { return []; }
    }

    // Yêu cầu đăng nhập mới được nhận việc
    function acceptJob(jobId) {
        const currentUser = getCurrentUser();

        if (!currentUser) {
            showToast('Vui lòng đăng ký hoặc đăng nhập để nhận việc!', 'error');
            authModal?.classList.remove('hidden');
            authModal?.classList.add('flex');
            return false;
        }

        const jobs = getJobs();
        const accepted = getAcceptedJobs();
        const target = jobs.find(j => j.id === jobId);
        
        if (target && !accepted.some(j => j.id === jobId)) {
            accepted.unshift({ 
                ...target, 
                checkedIn: false, 
                rating: null,
                acceptedBy: { 
                    name: currentUser.name, 
                    phone: currentUser.phone, 
                    time: new Date().toLocaleString('vi-VN') 
                }
            });
            localStorage.setItem('accepted_jobs_list', JSON.stringify(accepted));
            return true;
        }
        return false;
    }

    window.updateJobState = function(jobId, action, value = null) {
        const accepted = getAcceptedJobs();
        const target = accepted.find(j => j.id === jobId);
        if (target) {
            if (action === 'checkin') {
                target.checkedIn = true;
                showToast('Chấm công thành công!', 'success');
            } else if (action === 'rate') {
                target.rating = value;
                showToast(`Đã đánh giá ${value} sao!`, 'success');
            }
            localStorage.setItem('accepted_jobs_list', JSON.stringify(accepted));
            renderAcceptedJobs();
        }
    };

    function renderAcceptedJobs() {
        const acceptedContainer = document.getElementById('acceptedJobList');
        if (!acceptedContainer) return;

        const currentUser = getCurrentUser();
        const acceptedList = getAcceptedJobs();

        const myAccepted = currentUser 
            ? acceptedList.filter(j => j.acceptedBy && j.acceptedBy.phone === currentUser.phone)
            : acceptedList;

        acceptedContainer.innerHTML = '';

        if (!currentUser) {
            acceptedContainer.innerHTML = `
                <div class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <p class="text-slate-500 text-sm font-medium">Bạn chưa đăng nhập!</p>
                    <button onclick="document.getElementById('btnLoginAccount').click()" class="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs">Đăng nhập ngay</button>
                </div>`;
            return;
        }

        if (myAccepted.length === 0) {
            acceptedContainer.innerHTML = `
                <div class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <i class="fa-solid fa-briefcase text-3xl text-slate-300 mb-2"></i>
                    <p class="text-slate-400 text-sm">Bạn chưa nhận công việc nào.</p>
                </div>`;
            return;
        }

        myAccepted.forEach(job => {
            const card = document.createElement('div');
            card.className = "p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3";
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-slate-800 text-base">${job.title}</h3>
                        <p class="text-xs text-slate-500 mt-0.5">📍 ${job.location} &bull; 💰 ${job.salary}</p>
                    </div>
                    <span class="px-2.5 py-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold rounded-full">Đã nhận</span>
                </div>
                <div class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                    <p><strong>Người đăng việc:</strong> ${job.createdByName || 'Thành viên'} (${job.phone})</p>
                    <p><strong>Thời gian nhận:</strong> ${job.acceptedBy?.time || 'Vừa xong'}</p>
                </div>
                <div class="flex gap-2 pt-1">
                    <button onclick="window.updateJobState(${job.id}, 'checkin')" class="flex-1 py-2 ${job.checkedIn ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-teal-600 hover:bg-teal-700 text-white'} rounded-xl text-xs font-bold transition">
                        ${job.checkedIn ? '<i class="fa-solid fa-circle-check"></i> Đã chấm công' : 'Chấm công hoàn thành'}
                    </button>
                    <button onclick="let r=prompt('Đánh giá công việc (1-5 sao):', '5'); if(r) window.updateJobState(${job.id}, 'rate', r)" class="px-3 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl text-xs font-bold transition">
                        ⭐ ${job.rating ? job.rating + ' Sao' : 'Đánh giá'}
                    </button>
                </div>
            `;
            acceptedContainer.appendChild(card);
        });
    }

    function showToast(message, type = 'success') {
        const existing = document.getElementById('appToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'appToast';
        toast.className = `fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-bold text-white shadow-xl flex items-center gap-2 ${type === 'success' ? 'bg-teal-600' : 'bg-red-600'}`;
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-sm"></i> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- 5. GIAO DIỆN & RENDER CHÍNH ---
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    const urgentCheck = document.getElementById('urgentCheck');
    const jobListContainer = document.getElementById('jobList');
    const jobCountSpan = document.getElementById('jobCount');
    const categoryBtns = document.querySelectorAll('.category-btn');
    let currentCategory = 'all';

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => {
                b.classList.remove('bg-slate-900', 'text-white');
                b.classList.add('bg-slate-100', 'text-slate-600');
            });
            btn.classList.remove('bg-slate-100', 'text-slate-600');
            btn.classList.add('bg-slate-900', 'text-white');
            currentCategory = btn.getAttribute('data-category');
            renderJobs();
        });
    });

    function renderJobs() {
        if (!jobListContainer) return;
        const jobsList = getJobs();
        const acceptedList = getAcceptedJobs();
        const currentUser = getCurrentUser();
        const isAdmin = localStorage.getItem('is_admin_logged') === 'true' || (currentUser && currentUser.role === 'admin');

        const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedLocation = locationSelect ? locationSelect.value : '';
        const isUrgentOnly = urgentCheck ? urgentCheck.checked : false;

        const filtered = jobsList.filter(job => {
            const matchesKw = job.title.toLowerCase().includes(keyword) || job.location.toLowerCase().includes(keyword);
            const matchesLoc = !selectedLocation || job.location === selectedLocation;
            const matchesCat = currentCategory === 'all' || job.category === currentCategory;
            const matchesUrg = !isUrgentOnly || job.isUrgent === true;
            return matchesKw && matchesLoc && matchesCat && matchesUrg;
        });

        if (jobCountSpan) jobCountSpan.textContent = `${filtered.length} việc phù hợp`;
        jobListContainer.innerHTML = '';

        if (filtered.length === 0) {
            jobListContainer.innerHTML = `<div class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200"><p class="text-slate-400 text-sm">Không tìm thấy công việc phù hợp.</p></div>`;
            return;
        }

        filtered.forEach(job => {
            const isAccepted = acceptedList.some(item => item.id === job.id);
            const isMyJob = currentUser && currentUser.phone === job.createdBy;
            const canDelete = isMyJob || isAdmin;

            const card = document.createElement('div');
            card.className = `p-4 bg-white rounded-2xl border ${isMyJob ? 'border-teal-300 bg-teal-50/20' : 'border-slate-100'} shadow-sm flex justify-between items-center`;
            card.innerHTML = `
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-slate-800 text-sm md:text-base">${job.title}</h3>
                        ${job.isUrgent ? '<span class="px-2 py-0.5 text-[10px] bg-red-100 text-red-600 font-bold rounded-md">GẤP</span>' : ''}
                        ${isMyJob ? '<span class="px-2 py-0.5 text-[10px] bg-teal-100 text-teal-700 font-bold rounded-md">CỦA BẠN</span>' : ''}
                    </div>
                    <p class="text-xs text-slate-500 font-medium">📍 ${job.location} &bull; 💰 ${job.salary}</p>
                    <p class="text-xs text-teal-700 font-semibold">👤 Đăng bởi: ${job.createdByName || 'Thành viên'} (${job.phone})</p>
                </div>
                <div class="flex items-center gap-2">
                    ${canDelete ? `
                        <button data-id="${job.id}" class="btn-delete-job px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold rounded-xl transition flex items-center gap-1">
                            <i class="fa-solid fa-trash"></i> Xóa
                        </button>
                    ` : ''}
                    <button data-id="${job.id}" class="btn-accept px-3 py-1.5 text-xs font-semibold rounded-xl transition ${isAccepted ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-slate-900 hover:bg-slate-800 text-white'}">
                        ${isAccepted ? 'Đã nhận' : 'Nhận việc'}
                    </button>
                </div>
            `;
            jobListContainer.appendChild(card);
        });

        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.getAttribute('data-id'));
                if (acceptJob(id)) {
                    showToast('Nhận việc thành công!');
                    renderJobs();
                    renderAcceptedJobs();
                }
            });
        });

        document.querySelectorAll('.btn-delete-job').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.getAttribute('data-id'));
                deleteJob(id);
            });
        });
    }

    // Modal Đăng việc
    const postJobModal = document.getElementById('postJobModal');
    const btnPostJob = document.getElementById('btnPostJob');
    const btnFloatingPostJob = document.getElementById('btnFloatingPostJob');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const postJobForm = document.getElementById('postJobForm');

    function openPostJobModal() {
        const user = getCurrentUser();
        if (!user) {
            showToast('Vui lòng đăng nhập để đăng việc!', 'error');
            authModal?.classList.remove('hidden');
            authModal?.classList.add('flex');
        } else {
            const phoneInput = document.getElementById('jobPhoneInput');
            if (phoneInput) phoneInput.value = user.phone;
            postJobModal?.classList.remove('hidden');
            postJobModal?.classList.add('flex');
        }
    }

    if (btnPostJob) btnPostJob.addEventListener('click', openPostJobModal);
    if (btnFloatingPostJob) btnFloatingPostJob.addEventListener('click', openPostJobModal);
    btnCloseModal?.addEventListener('click', () => postJobModal?.classList.add('hidden'));
    btnCancelModal?.addEventListener('click', () => postJobModal?.classList.add('hidden'));

    postJobForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        const newJob = {
            id: Date.now(),
            title: document.getElementById('jobTitleInput').value.trim(),
            phone: document.getElementById('jobPhoneInput').value.trim(),
            location: document.getElementById('jobLocationInput').value,
            category: document.getElementById('jobCategoryInput').value,
            salary: document.getElementById('jobSalaryInput').value.trim() || 'Thỏa thuận',
            isUrgent: document.getElementById('jobUrgentInput')?.checked || false,
            createdByName: user ? user.name : 'Thành viên',
            createdBy: user ? user.phone : 'Chưa cập nhật'
        };

        if (!newJob.title) return;
        saveJob(newJob);
        postJobModal?.classList.add('hidden');
        postJobForm.reset();
        showToast('Đăng việc thành công!');
        renderJobs();
    });

    if (searchInput) searchInput.addEventListener('input', renderJobs);
    if (locationSelect) locationSelect.addEventListener('change', renderJobs);
    if (urgentCheck) urgentCheck.addEventListener('change', renderJobs);

    updateAuthButtonUI();
    renderJobs();
    renderOrganizations();
    renderAcceptedJobs();
});