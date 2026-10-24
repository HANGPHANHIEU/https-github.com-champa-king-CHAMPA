document.addEventListener('DOMContentLoaded', () => {
    // --- PHẦN 1: QUẢN LÝ DỮ LIỆU & LOCALSTORAGE ---
    const defaultJobs = [
        { id: 1, title: 'Một chuyến giao hàng hỏa tốc', location: 'Quận 3', category: 'delivery', salary: '180.000đ / chuyến', isUrgent: true },
        { id: 2, title: 'Dọn dẹp căn hộ chung cư 2 phòng ngủ', location: 'Quận 7', category: 'cleaning', salary: '300.000đ / buổi', isUrgent: false },
        { id: 3, title: 'Sửa đường ống nước bị rò rỉ tại nhà', location: 'Bình Thạnh', category: 'repair', salary: '250.000đ', isUrgent: true },
        { id: 4, title: 'Phục vụ bàn nhà hàng tiệc cưới', location: 'Quận 1', category: 'service', salary: '50.000đ / giờ', isUrgent: false }
    ];

    const defaultOrgs = [
        { id: 1, name: 'Hợp tác xã Vận tải Sài Gòn', field: 'Logistics & Giao hàng', location: 'Quận 3' },
        { id: 2, name: 'Dịch vụ Vệ sinh Xanh Clean', field: 'Vệ sinh công nghiệp', location: 'Quận 7' }
    ];

    function getJobs() {
        const saved = localStorage.getItem('my_jobs_list');
        return saved ? JSON.parse(saved) : defaultJobs;
    }

    function saveJob(newJob) {
        const jobs = getJobs();
        jobs.unshift(newJob);
        localStorage.setItem('my_jobs_list', JSON.stringify(jobs));
        return jobs;
    }

    function getAcceptedJobs() {
        const saved = localStorage.getItem('accepted_jobs_list');
        return saved ? JSON.parse(saved) : [];
    }

    function acceptJob(jobId) {
        const jobs = getJobs();
        const accepted = getAcceptedJobs();
        const target = jobs.find(j => j.id === jobId);
        if (target && !accepted.some(j => j.id === jobId)) {
            accepted.unshift(target);
            localStorage.setItem('accepted_jobs_list', JSON.stringify(accepted));
            return true;
        }
        return false;
    }

    function getOrganizations() {
        const saved = localStorage.getItem('organizations_list');
        return saved ? JSON.parse(saved) : defaultOrgs;
    }

    function saveOrganization(newOrg) {
        const orgs = getOrganizations();
        orgs.unshift(newOrg);
        localStorage.setItem('organizations_list', JSON.stringify(orgs));
        return orgs;
    }

    // --- PHẦN 2: XỬ LÝ GIAO DIỆN & SỰ KIỆN ---
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    const urgentCheck = document.getElementById('urgentCheck');
    const btnPostJob = document.getElementById('btnPostJob');
    const btnJoinOrg = document.getElementById('btnJoinOrg');
    
    const jobListContainer = document.getElementById('jobList');
    const acceptedJobListContainer = document.getElementById('acceptedJobList');
    const orgListContainer = document.getElementById('orgList');
    const mapPinsContainer = document.getElementById('mapPinsContainer');
    const jobCountSpan = document.getElementById('jobCount');
    const mapSummaryText = document.getElementById('mapSummaryText');

    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const postJobModal = document.getElementById('postJobModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const postJobForm = document.getElementById('postJobForm');

    const orgModal = document.getElementById('orgModal');
    const btnCloseOrgModal = document.getElementById('btnCloseOrgModal');
    const btnCancelOrgModal = document.getElementById('btnCancelOrgModal');
    const orgForm = document.getElementById('orgForm');

    let currentCategory = 'all';

    // Chuyển Tab
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTabId = btn.getAttribute('data-tab');

            navBtns.forEach(b => {
                b.classList.remove('text-[#0d9488]');
                b.classList.add('text-slate-400');
            });
            btn.classList.remove('text-slate-400');
            btn.classList.add('text-[#0d9488]');

            tabContents.forEach(tab => {
                if (tab.id === targetTabId) {
                    tab.classList.remove('hidden');
                } else {
                    tab.classList.add('hidden');
                }
            });

            if (targetTabId === 'tabAcceptedJob') renderAcceptedJobs();
            else if (targetTabId === 'tabOrganization') renderOrganizations();
            else if (targetTabId === 'tabMap') renderRadarMap();
        });
    });

    // Render danh sách việc
    function renderJobs() {
        if (!jobListContainer) return;

        const jobsList = getJobs();
        const acceptedList = getAcceptedJobs();
        const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedLocation = locationSelect ? locationSelect.value : '';
        const isUrgentOnly = urgentCheck ? urgentCheck.checked : false;

        const filteredJobs = jobsList.filter(job => {
            const matchesKeyword = job.title.toLowerCase().includes(keyword);
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
            card.className = 'p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex justify-between items-center';
            card.innerHTML = `
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-slate-800 text-sm md:text-base">${job.title}</h3>
                        ${job.isUrgent ? '<span class="px-2 py-0.5 text-[10px] bg-red-100 text-red-600 font-bold rounded-md">GẤP</span>' : ''}
                    </div>
                    <p class="text-xs text-slate-500 font-medium">📍 ${job.location} &bull; 💰 ${job.salary}</p>
                </div>
                <button data-id="${job.id}" class="btn-accept px-3.5 py-2 text-xs font-semibold rounded-xl transition shadow-sm whitespace-nowrap ${isAccepted ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-slate-900 hover:bg-slate-800 text-white'}">
                    ${isAccepted ? 'Đã nhận' : 'Nhận việc'}
                </button>
            `;
            jobListContainer.appendChild(card);
        });

        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = Number(e.currentTarget.getAttribute('data-id'));
                if (acceptJob(jobId)) {
                    alert('Nhận việc thành công! Kiểm tra trong tab "Đã nhận".');
                    renderJobs();
                } else {
                    alert('Bạn đã nhận công việc này rồi.');
                }
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
            card.className = 'p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm flex justify-between items-center bg-emerald-50/20';
            card.innerHTML = `
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-slate-800 text-sm md:text-base">${job.title}</h3>
                        <span class="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 font-bold rounded-md">ĐÃ NHẬN</span>
                    </div>
                    <p class="text-xs text-slate-500 font-medium">📍 ${job.location} &bull; 💰 ${job.salary}</p>
                </div>
                <span class="text-xs font-semibold text-teal-600">Sẵn sàng thực hiện</span>
            `;
            acceptedJobListContainer.appendChild(card);
        });
    }

    function renderOrganizations() {
        if (!orgListContainer) return;
        const orgs = getOrganizations();
        orgListContainer.innerHTML = '';

        orgs.forEach(org => {
            const card = document.createElement('div');
            card.className = 'p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between';
            card.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-bold">
                        <i class="fa-solid fa-building"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 text-sm">${org.name}</h3>
                        <p class="text-xs text-slate-500">${org.field} &bull; 📍 ${org.location}</p>
                    </div>
                </div>
                <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">Đối tác</span>
            `;
            orgListContainer.appendChild(card);
        });
    }

    function renderRadarMap() {
        if (!mapPinsContainer) return;
        const jobs = getJobs();
        mapPinsContainer.innerHTML = '';

        if (mapSummaryText) mapSummaryText.textContent = `Hệ thống quét thấy ${jobs.length} điểm việc làm đang hoạt động.`;

        jobs.forEach((job, index) => {
            const pin = document.createElement('div');
            const positions = ['top-10 left-12', 'top-20 right-16', 'bottom-16 left-20', 'bottom-12 right-12', 'top-1/2 left-1/3'];
            const posClass = positions[index % positions.length];

            pin.className = `absolute ${posClass} group cursor-pointer`;
            pin.innerHTML = `
                <div class="relative flex items-center justify-center">
                    <span class="absolute w-8 h-8 rounded-full bg-teal-500/30 animate-ping"></span>
                    <div class="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg border-2 border-white">
                        <i class="fa-solid fa-briefcase text-[10px]"></i>
                    </div>
                    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-xl whitespace-nowrap z-30">
                        <p class="font-bold">${job.title}</p>
                        <p class="text-teal-400">📍 ${job.location} - 💰 ${job.salary}</p>
                    </div>
                </div>
            `;
            mapPinsContainer.appendChild(pin);
        });
    }

    // Modal Controls
    const openPostModal = () => { postJobModal?.classList.remove('hidden'); postJobModal?.classList.add('flex'); };
    const closePostModal = () => { postJobModal?.classList.add('hidden'); postJobModal?.classList.remove('flex'); postJobForm?.reset(); };
    
    const openOrgModal = () => { orgModal?.classList.remove('hidden'); orgModal?.classList.add('flex'); };
    const closeOrgModal = () => { orgModal?.classList.add('hidden'); orgModal?.classList.remove('flex'); orgForm?.reset(); };

    if (btnPostJob) btnPostJob.addEventListener('click', openPostModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closePostModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closePostModal);

    if (btnJoinOrg) btnJoinOrg.addEventListener('click', openOrgModal);
    if (btnCloseOrgModal) btnCloseOrgModal.addEventListener('click', closeOrgModal);
    if (btnCancelOrgModal) btnCancelOrgModal.addEventListener('click', closeOrgModal);

    if (postJobForm) {
        postJobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newJob = {
                id: Date.now(),
                title: document.getElementById('jobTitleInput').value.trim(),
                location: document.getElementById('jobLocationInput').value,
                category: document.getElementById('jobCategoryInput').value,
                salary: document.getElementById('jobSalaryInput').value.trim() || 'Thỏa thuận',
                isUrgent: document.getElementById('jobUrgentInput').checked
            };
            if (!newJob.title) return;
            saveJob(newJob);
            closePostModal();
            renderJobs();
            alert('Đăng công việc thành công!');
        });
    }

    if (orgForm) {
        orgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newOrg = {
                id: Date.now(),
                name: document.getElementById('orgNameInput').value.trim(),
                field: document.getElementById('orgFieldInput').value.trim(),
                location: document.getElementById('orgLocationInput').value
            };
            if (!newOrg.name) return;
            saveOrganization(newOrg);
            closeOrgModal();
            alert('Đăng ký tổ chức đối tác thành công!');
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