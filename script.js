document.addEventListener('DOMContentLoaded', () => {

    const defaultJobs = [
        { id: 1, title: 'Một chuyến giao hàng hỏa tốc', phone: '0901112223', location: 'Quận 3', category: 'delivery', salary: '180.000đ / chuyến', isUrgent: true, createdByName: 'Nguyễn Văn A', createdBy: '0901112223' },
        { id: 2, title: 'Dọn dẹp căn hộ chung cư 2 phòng ngủ', phone: '0904445556', location: 'Quận 7', category: 'cleaning', salary: '300.000đ / buổi', isUrgent: false, createdByName: 'Trần Thị B', createdBy: '0904445556' },
        { id: 3, title: 'Sửa đường ống nước bị rò rỉ tại nhà', phone: '0907778889', location: 'Bình Thạnh', category: 'repair', salary: '250.000đ', isUrgent: true, createdByName: 'Lê Văn C', createdBy: '0907778889' }
    ];

    const defaultOrgs = [
        { id: 1, name: 'Hợp tác xã Vận tải Sài Gòn', phone: '0903123456', address: '12 Cách Mạng Tháng 8', strength: 'Giao hàng nhanh, bảo quản tốt', location: 'Quận 3', status: 'approved' }
    ];

    const defaultWorkers = [
        { id: 1, name: 'Trần Văn Bình', phone: '0988123456', skill: 'Giao hàng hỏa tốc, Tài xế công nghệ', location: 'Quận 3', status: 'approved' }
    ];

    // --- TỰ ĐỘNG THÊM 2 NÚT BẤM LỚN (GRAB & XANH SM) PHÍA TRÊN ---
    function renderRideHailingButtons() {
        const tabJob = document.getElementById('tabJob');
        if (!tabJob) return;

        if (document.getElementById('rideHailingContainer')) return;

        const rideContainer = document.createElement('div');
        rideContainer.id = 'rideHailingContainer';
        rideContainer.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6';
        rideContainer.innerHTML = `
            <!-- Nút Xe Ôm Grab -->
            <a href="https://www.grab.com/vi/driver/drive/" target="_blank" rel="noopener noreferrer" 
               class="flex items-center justify-between p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 group">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-black">
                        <i class="fa-solid fa-motorcycle"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-base leading-tight">Xe Ôm (Grab)</h3>
                        <p class="text-xs text-emerald-100 font-medium mt-0.5">Đăng ký / Gọi xe GrabBike nhanh</p>
                    </div>
                </div>
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <i class="fa-solid fa-arrow-right text-sm"></i>
                </div>
            </a>

            <!-- Nút Xe Ôm Xanh SM -->
            <a href="https://www.xanhsm.com/" target="_blank" rel="noopener noreferrer" 
               class="flex items-center justify-between p-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 group">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-black">
                        <i class="fa-solid fa-bolt"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-base leading-tight">Xe Ôm (Xanh SM)</h3>
                        <p class="text-xs text-teal-100 font-medium mt-0.5">Đối tác / Đặt xe máy điện Green SM</p>
                    </div>
                </div>
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <i class="fa-solid fa-arrow-right text-sm"></i>
                </div>
            </a>
        `;
        tabJob.insertBefore(rideContainer, tabJob.firstChild);
    }

    renderRideHailingButtons();

    // --- QUẢN LÝ LOCALSTORAGE ---
    function getJobs() {
        try {
            const saved = localStorage.getItem('my_jobs_list');
            return saved ? JSON.parse(saved) : defaultJobs;
        } catch (e) {
            return defaultJobs;
        }
    }

    function saveJob(newJob) {
        const jobs = getJobs();
        jobs.unshift(newJob);
        localStorage.setItem('my_jobs_list', JSON.stringify(jobs));
    }

    // Đã xóa bỏ phần bắt buộc nhập tên người tạo, giờ chỉ hỏi xác nhận bằng thông báo đơn giản (hoặc xóa thẳng)
    function deleteJob(jobId) {
        let jobs = getJobs();
        const targetJob = jobs.find(j => j.id === jobId);

        if (!targetJob) return;

        if (confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            jobs = jobs.filter(j => j.id !== jobId);
            localStorage.setItem('my_jobs_list', JSON.stringify(jobs));
            renderJobs();
            showToast('Đã xóa công việc thành công.');
        }
    }

    function getAcceptedJobs() {
        try {
            const saved = localStorage.getItem('accepted_jobs_list');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    function acceptJob(jobId) {
        const jobs = getJobs();
        const accepted = getAcceptedJobs();
        const target = jobs.find(j => j.id === jobId);
        
        if (target && !accepted.some(j => j.id === jobId)) {
            const workerName = prompt("Nhập họ và tên của bạn để nhận việc:");
            const workerPhone = prompt("Nhập số điện thoại liên hệ của bạn:");

            if (!workerName || !workerName.trim() || !workerPhone || !workerPhone.trim()) {
                showToast('Vui lòng nhập đầy đủ họ tên và số điện thoại!', 'error');
                return false;
            }

            accepted.unshift({ 
                ...target, 
                checkedIn: false, 
                rating: null,
                acceptedBy: {
                    name: workerName.trim(),
                    phone: workerPhone.trim(),
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
                showToast('Chấm công thành công ca làm việc!', 'success');
            } else if (action === 'rate') {
                target.rating = value;
                showToast(`Đã gửi đánh giá ${value} sao! Cảm ơn bạn.`, 'success');
            }
            localStorage.setItem('accepted_jobs_list', JSON.stringify(accepted));
            renderAcceptedJobs();
        }
    };

    function getOrganizations() {
        try {
            const saved = localStorage.getItem('organizations_list');
            return saved ? JSON.parse(saved) : defaultOrgs;
        } catch (e) {
            return defaultOrgs;
        }
    }

    function saveOrganization(newOrg) {
        const orgs = getOrganizations();
        orgs.unshift(newOrg);
        localStorage.setItem('organizations_list', JSON.stringify(orgs));
    }

    function getWorkers() {
        try {
            const saved = localStorage.getItem('workers_list');
            return saved ? JSON.parse(saved) : defaultWorkers;
        } catch (e) {
            return defaultWorkers;
        }
    }

    function saveWorker(newWorker) {
        const workers = getWorkers();
        workers.unshift(newWorker);
        localStorage.setItem('workers_list', JSON.stringify(workers));
    }

    // --- HỆ THỐNG THÔNG BÁO TOAST ---
    function showToast(message, type = 'success') {
        const existingToast = document.getElementById('appToast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'appToast';
        toast.className = `fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-bold text-white shadow-xl transition-all duration-300 flex items-center gap-2 ${
            type === 'success' ? 'bg-teal-600' : 'bg-red-600'
        }`;
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-sm"></i> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- CÁC PHẦN TỬ GIAO DIỆN ---
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    const urgentCheck = document.getElementById('urgentCheck');
    const jobListContainer = document.getElementById('jobList');
    const acceptedJobListContainer = document.getElementById('acceptedJobList');
    const orgListContainer = document.getElementById('orgList');
    const mapPinsContainer = document.getElementById('mapPinsContainer');
    const jobCountSpan = document.getElementById('jobCount');
    const mapSummaryText = document.getElementById('mapSummaryText');

    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    let currentCategory = 'all';

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTabId = btn.getAttribute('data-tab');
            navBtns.forEach(b => { b.classList.remove('text-[#0d9488]'); b.classList.add('text-slate-400'); });
            btn.classList.remove('text-slate-400'); btn.classList.add('text-[#0d9488]');

            tabContents.forEach(tab => {
                tab.id === targetTabId ? tab.classList.remove('hidden') : tab.classList.add('hidden');
            });

            if (targetTabId === 'tabAcceptedJob') renderAcceptedJobs();
            else if (targetTabId === 'tabOrganization') renderOrganizations();
            else if (targetTabId === 'tabMap') renderRadarMap();
        });
    });

    // Render danh sách việc làm
    function renderJobs() {
        if (!jobListContainer) return;
        const jobsList = getJobs();
        const acceptedList = getAcceptedJobs();
        const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedLocation = locationSelect ? locationSelect.value : '';
        const isUrgentOnly = urgentCheck ? urgentCheck.checked : false;

        const filteredJobs = jobsList.filter(job => {
            const matchesKeyword = job.title.toLowerCase().includes(keyword) || job.location.toLowerCase().includes(keyword);
            const matchesLocation = !selectedLocation || job.location === selectedLocation;
            const matchesCategory = currentCategory === 'all' || job.category === currentCategory;
            const matchesUrgent = !isUrgentOnly || job.isUrgent === true;
            return matchesKeyword && matchesLocation && matchesCategory && matchesUrgent;
        });

        if (jobCountSpan) jobCountSpan.textContent = `${filteredJobs.length} việc phù hợp`;
        jobListContainer.innerHTML = '';

        if (filteredJobs.length === 0) {
            jobListContainer.innerHTML = `<div class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200"><p class="text-slate-400 text-sm">Không tìm thấy công việc phù hợp.</p></div>`;
            return;
        }

        filteredJobs.forEach(job => {
            const isAccepted = acceptedList.some(item => item.id === job.id);
            const card = document.createElement('div');
            card.className = 'p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center transition hover:shadow-md';
            card.innerHTML = `
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-slate-800 text-sm md:text-base">${job.title}</h3>
                        ${job.isUrgent ? '<span class="px-2 py-0.5 text-[10px] bg-red-100 text-red-600 font-bold rounded-md">GẤP</span>' : ''}
                    </div>
                    <p class="text-xs text-slate-500 font-medium">📍 ${job.location} &bull; 💰 ${job.salary}</p>
                    <p class="text-xs text-teal-700 font-semibold">👤 Đăng bởi: ${job.createdByName || 'Ẩn danh'} &bull; 📞 ${job.phone || 'Chưa cập nhật'}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button data-id="${job.id}" class="btn-accept px-3 py-1.5 text-xs font-semibold rounded-xl transition shadow-sm ${isAccepted ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-slate-900 hover:bg-slate-800 text-white'}">
                        ${isAccepted ? 'Đã nhận' : 'Nhận việc'}
                    </button>
                    <button data-id="${job.id}" class="btn-delete-job px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded-xl transition" title="Xóa việc">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            jobListContainer.appendChild(card);
        });

        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = Number(e.currentTarget.getAttribute('data-id'));
                if (acceptJob(jobId)) {
                    showToast('Nhận việc thành công! Kiểm tra trong tab "Đã nhận".');
                    renderJobs();
                }
            });
        });

        document.querySelectorAll('.btn-delete-job').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = Number(e.currentTarget.getAttribute('data-id'));
                deleteJob(jobId);
            });
        });
    }

    function renderAcceptedJobs() {
        if (!acceptedJobListContainer) return;
        const acceptedList = getAcceptedJobs();
        acceptedJobListContainer.innerHTML = '';

        if (acceptedList.length === 0) {
            acceptedJobListContainer.innerHTML = `<div class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200"><p class="text-slate-400 text-sm">Bạn chưa nhận công việc nào.</p></div>`;
            return;
        }

        acceptedList.forEach(job => {
            const card = document.createElement('div');
            card.className = 'p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm space-y-3';
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <h3 class="font-bold text-slate-800 text-sm md:text-base">${job.title}</h3>
                            <span class="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 font-bold rounded-md">ĐÃ NHẬN</span>
                        </div>
                        <p class="text-xs text-slate-500 font-medium">📍 ${job.location} &bull; 💰 ${job.salary}</p>
                        <p class="text-xs text-teal-700 font-semibold">📞 LH Nhà tuyển dụng: ${job.phone}</p>
                    </div>
                    <div>
                        ${job.checkedIn ? 
                            '<span class="text-xs bg-teal-50 text-teal-700 font-semibold px-3 py-1.5 rounded-lg border border-teal-200">Đã chấm công ✓</span>' : 
                            `<button onclick="updateJobState(${job.id}, 'checkin')" class="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition shadow-sm">Chấm công</button>`
                        }
                    </div>
                </div>

                ${job.acceptedBy ? `
                    <div class="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs space-y-1">
                        <p class="font-bold text-teal-900 flex items-center"><i class="fa-solid fa-user-check mr-1.5 text-teal-600"></i> Thông tin người thực hiện:</p>
                        <p class="text-slate-700">👤 Họ tên: <b>${job.acceptedBy.name}</b></p>
                        <p class="text-slate-700">📞 Số điện thoại: <b>${job.acceptedBy.phone}</b></p>
                        <p class="text-slate-400 text-[11px]">⏱ Nhận lúc: ${job.acceptedBy.time}</p>
                    </div>
                ` : ''}

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span class="font-semibold text-slate-600">Đánh giá chất lượng:</span>
                    <div class="flex items-center gap-1">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <button onclick="updateJobState(${job.id}, 'rate', ${star})" class="text-base ${job.rating >= star ? 'text-amber-400' : 'text-slate-300'} hover:text-amber-400 transition">
                                <i class="fa-solid fa-star"></i>
                            </button>
                        `).join('')}
                        <span class="ml-2 font-bold text-slate-700">${job.rating ? `(${job.rating}/5 sao)` : '(Chưa đánh giá)'}</span>
                    </div>
                </div>
            `;
            acceptedJobListContainer.appendChild(card);
        });
    }

    function renderOrganizations() {
        if (!orgListContainer) return;
        const orgs = getOrganizations().filter(o => o.status === 'approved');
        const workers = getWorkers().filter(w => w.status === 'approved');
        orgListContainer.innerHTML = '';

        const workerHeader = document.createElement('div');
        workerHeader.innerHTML = `<h3 class="font-bold text-slate-900 text-sm mb-2"><i class="fa-solid fa-users mr-1.5 text-amber-500"></i> Hồ sơ Cá nhân đã kiểm duyệt</h3>`;
        orgListContainer.appendChild(workerHeader);

        if (workers.length === 0) {
            orgListContainer.innerHTML += `<p class="text-xs text-slate-400 mb-4">Chưa có hồ sơ cá nhân nào được phê duyệt.</p>`;
        } else {
            workers.forEach(w => {
                const card = document.createElement('div');
                card.className = 'p-4 bg-amber-50/40 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between mb-3';
                card.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-800 text-sm">${w.name}</h3>
                            <p class="text-xs text-slate-500">📞 ${w.phone} &bull; 📍 ${w.location}</p>
                            <p class="text-xs text-amber-700 font-medium mt-0.5">Sở trường: ${w.skill}</p>
                        </div>
                    </div>
                    <span class="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-bold">Đã duyệt ✓</span>
                `;
                orgListContainer.appendChild(card);
            });
        }

        const orgHeader = document.createElement('div');
        orgHeader.innerHTML = `<h3 class="font-bold text-slate-900 text-sm mb-2 mt-6"><i class="fa-solid fa-building mr-1.5 text-teal-600"></i> Doanh nghiệp & Tổ chức đối tác</h3>`;
        orgListContainer.appendChild(orgHeader);

        if (orgs.length === 0) {
            orgListContainer.innerHTML += `<p class="text-xs text-slate-400 mb-4">Chưa có tổ chức nào được phê duyệt.</p>`;
        } else {
            orgs.forEach(org => {
                const card = document.createElement('div');
                card.className = 'p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2 mb-3';
                card.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-bold">
                            <i class="fa-solid fa-building"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-800 text-sm">${org.name}</h3>
                            <p class="text-xs text-slate-500">📞 ${org.phone} &bull; 📍 ${org.address}, ${org.location}</p>
                        </div>
                    </div>
                    <div class="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-600">
                        <span class="font-semibold text-teal-700">Thế mạnh:</span> ${org.strength}
                    </div>
                `;
                orgListContainer.appendChild(card);
            });
        }
    }

    function renderRadarMap() {
        if (!mapPinsContainer) return;
        const jobs = getJobs();
        mapPinsContainer.innerHTML = '';
        if (mapSummaryText) mapSummaryText.textContent = `Hệ thống quét thấy ${jobs.length} điểm việc làm đang hoạt động.`;

        jobs.forEach((job, index) => {
            const pin = document.createElement('div');
            const positions = ['top-10 left-12', 'top-20 right-16', 'bottom-16 left-20', 'bottom-12 right-12', 'top-1/2 left-1/3'];
            pin.className = `absolute ${positions[index % positions.length]} group cursor-pointer`;
            pin.innerHTML = `
                <div class="relative flex items-center justify-center">
                    <span class="absolute w-8 h-8 rounded-full bg-teal-500/30 animate-ping"></span>
                    <div class="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg border-2 border-white">
                        <i class="fa-solid fa-briefcase text-[10px]"></i>
                    </div>
                    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-xl whitespace-nowrap z-30">
                        <p class="font-bold">${job.title}</p>
                        <p class="text-teal-400">📍 ${job.location} - 💰 ${job.salary} - 👤 ${job.createdByName || 'N/A'}</p>
                    </div>
                </div>
            `;
            mapPinsContainer.appendChild(pin);
        });
    }

    // --- MODAL CONTROLS ---
    const postJobModal = document.getElementById('postJobModal');
    const btnPostJob = document.getElementById('btnPostJob');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const postJobForm = document.getElementById('postJobForm');

    const orgModal = document.getElementById('orgModal');
    const btnJoinOrg = document.getElementById('btnJoinOrg');
    const btnCloseOrgModal = document.getElementById('btnCloseOrgModal');
    const btnCancelOrgModal = document.getElementById('btnCancelOrgModal');
    const orgForm = document.getElementById('orgForm');

    const workerModal = document.getElementById('workerModal');
    const btnRegisterWorker = document.getElementById('btnRegisterWorker');
    const btnCloseWorkerModal = document.getElementById('btnCloseWorkerModal');
    const btnCancelWorkerModal = document.getElementById('btnCancelWorkerModal');
    const workerForm = document.getElementById('workerForm');

    if (btnPostJob) btnPostJob.addEventListener('click', () => { postJobModal?.classList.remove('hidden'); postJobModal?.classList.add('flex'); });
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => { postJobModal?.classList.add('hidden'); postJobModal?.classList.remove('flex'); });
    if (btnCancelModal) btnCancelModal.addEventListener('click', () => { postJobModal?.classList.add('hidden'); postJobModal?.classList.remove('flex'); });

    if (btnJoinOrg) btnJoinOrg.addEventListener('click', () => { orgModal?.classList.remove('hidden'); orgModal?.classList.add('flex'); });
    if (btnCloseOrgModal) btnCloseOrgModal.addEventListener('click', () => { orgModal?.classList.add('hidden'); orgModal?.classList.remove('flex'); });
    if (btnCancelOrgModal) btnCancelOrgModal.addEventListener('click', () => { orgModal?.classList.add('hidden'); orgModal?.classList.remove('flex'); });

    if (btnRegisterWorker) btnRegisterWorker.addEventListener('click', () => { workerModal?.classList.remove('hidden'); workerModal?.classList.add('flex'); });
    if (btnCloseWorkerModal) btnCloseWorkerModal.addEventListener('click', () => { workerModal?.classList.add('hidden'); workerModal?.classList.remove('flex'); });
    if (btnCancelWorkerModal) btnCancelWorkerModal.addEventListener('click', () => { workerModal?.classList.add('hidden'); workerModal?.classList.remove('flex'); });

    // Đăng việc mới (Đã loại bỏ bảng hỏi prompt nhập tên người tạo)
    if (postJobForm) {
        postJobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleVal = document.getElementById('jobTitleInput').value.trim();
            const phoneVal = document.getElementById('jobPhoneInput').value.trim();

            const newJob = {
                id: Date.now(),
                title: titleVal,
                phone: phoneVal,
                location: document.getElementById('jobLocationInput').value,
                category: document.getElementById('jobCategoryInput').value,
                salary: document.getElementById('jobSalaryInput').value.trim() || 'Thỏa thuận',
                isUrgent: document.getElementById('jobUrgentInput').checked,
                createdByName: 'Người đăng',
                createdBy: phoneVal
            };

            if (!newJob.title) return;
            saveJob(newJob);
            postJobModal?.classList.add('hidden');
            postJobModal?.classList.remove('flex');
            postJobForm.reset();
            renderJobs();
            showToast('Đăng công việc mới thành công!');
        });
    }

    if (orgForm) {
        orgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newOrg = {
                id: Date.now(),
                name: document.getElementById('orgNameInput').value.trim(),
                phone: document.getElementById('orgPhoneInput').value.trim(),
                address: document.getElementById('orgAddressInput').value.trim(),
                strength: document.getElementById('orgStrengthInput').value.trim(),
                location: document.getElementById('orgLocationInput').value,
                status: 'pending' 
            };
            if (!newOrg.name) return;
            saveOrganization(newOrg);
            orgModal?.classList.add('hidden');
            orgModal?.classList.remove('flex');
            orgForm.reset();
            showToast('Ghi danh thành công! Đang chờ Quản trị viên kiểm duyệt.');
        });
    }

    if (workerForm) {
        workerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newWorker = {
                id: Date.now(),
                name: document.getElementById('workerNameInput').value.trim(),
                phone: document.getElementById('workerPhoneInput').value.trim(),
                skill: document.getElementById('workerSkillInput').value.trim(),
                location: document.getElementById('workerLocationInput').value,
                status: 'pending' 
            };
            if (!newWorker.name) return;
            saveWorker(newWorker);
            workerModal?.classList.add('hidden');
            workerModal?.classList.remove('flex');
            workerForm.reset();
            showToast('Đăng ký hồ sơ thành công! Đang chờ Quản trị viên kiểm duyệt.');
        });
    }

    if (searchInput) searchInput.addEventListener('input', renderJobs);
    if (locationSelect) locationSelect.addEventListener('change', renderJobs);
    if (urgentCheck) urgentCheck.addEventListener('change', renderJobs);

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => {
                b.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
                b.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            });
            const clicked = e.currentTarget;
            clicked.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            clicked.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
            currentCategory = clicked.getAttribute('data-category');
            renderJobs();
        });
    });

    renderJobs();
});