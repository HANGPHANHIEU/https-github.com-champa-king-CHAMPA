// script.js - Giữ nguyên toàn bộ logic tương tác giao diện của bạn
import { getJobs, saveJob, getAcceptedJobs, acceptJob } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    const urgentCheck = document.getElementById('urgentCheck');
    const btnPostJob = document.getElementById('btnPostJob');
    const jobListContainer = document.getElementById('jobList');
    const acceptedJobListContainer = document.getElementById('acceptedJobList');
    const jobCountSpan = document.getElementById('jobCount');
    const mapPinsSummary = document.getElementById('mapPinsSummary');

    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const postJobModal = document.getElementById('postJobModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const postJobForm = document.getElementById('postJobForm');

    let currentCategory = 'all';

    // Chuyển đổi Tab
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

            if (targetTabId === 'tabAcceptedJob') {
                renderAcceptedJobs();
            } else if (targetTabId === 'tabMap') {
                updateMapSummary();
            }
        });
    });

    // Render danh sách tìm việc
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

        if (jobCountSpan) {
            jobCountSpan.textContent = `${filteredJobs.length} việc phù hợp`;
        }

        jobListContainer.innerHTML = '';

        if (filteredJobs.length === 0) {
            jobListContainer.innerHTML = `
                <div class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p class="text-slate-400 text-sm">Không tìm thấy công việc phù hợp.</p>
                </div>`;
            return;
        }

        filteredJobs.forEach(job => {
            const isAlreadyAccepted = acceptedList.some(item => item.id === job.id);
            const jobCard = document.createElement('div');
            jobCard.className = 'p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex justify-between items-center';
            jobCard.innerHTML = `
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-slate-800 text-sm md:text-base">${job.title}</h3>
                        ${job.isUrgent ? '<span class="px-2 py-0.5 text-[10px] bg-red-100 text-red-600 font-bold rounded-md">GẤP</span>' : ''}
                    </div>
                    <p class="text-xs text-slate-500 font-medium">📍 ${job.location} &bull; 💰 ${job.salary}</p>
                </div>
                <button data-id="${job.id}" class="btn-accept px-3.5 py-2 text-xs font-semibold rounded-xl transition shadow-sm whitespace-nowrap ${isAlreadyAccepted ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-slate-900 hover:bg-slate-800 text-white'}">
                    ${isAlreadyAccepted ? 'Đã nhận' : 'Ứng tuyển'}
                </button>
            `;
            jobListContainer.appendChild(jobCard);
        });

        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = Number(e.currentTarget.getAttribute('data-id'));
                const success = acceptJob(jobId);
                if (success) {
                    alert('Đã nhận công việc thành công! Kiểm tra trong mục "Đã nhận".');
                    renderJobs();
                } else {
                    alert('Bạn đã nhận công việc này trước đó rồi.');
                }
            });
        });
    }

    // Render việc đã nhận
    function renderAcceptedJobs() {
        if (!acceptedJobListContainer) return;
        const acceptedList = getAcceptedJobs();

        acceptedJobListContainer.innerHTML = '';

        if (acceptedList.length === 0) {
            acceptedJobListContainer.innerHTML = `
                <div class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p class="text-slate-400 text-sm">Bạn chưa nhận công việc nào.</p>
                </div>`;
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
                <span class="text-xs font-semibold text-teal-600">Sẵn sàng làm</span>
            `;
            acceptedJobListContainer.appendChild(card);
        });
    }

    // Tóm tắt bản đồ
    function updateMapSummary() {
        if (!mapPinsSummary) return;
        const jobsList = getJobs();
        mapPinsSummary.textContent = `📍 Đang có tổng số ${jobsList.length} việc làm sẵn sàng trên bản đồ.`;
    }

    // Danh mục Pills
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => {
                b.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
                b.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            });
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            clickedBtn.classList.add('bg-slate-900', 'text-white', 'shadow-sm');

            currentCategory = clickedBtn.getAttribute('data-category');
            renderJobs();
        });
    });

    // Modal đăng việc
    const openModal = () => { if (postJobModal) { postJobModal.classList.remove('hidden'); postJobModal.classList.add('flex'); } };
    const closeModal = () => { if (postJobModal) { postJobModal.classList.add('hidden'); postJobModal.classList.remove('flex'); postJobForm?.reset(); } };

    if (btnPostJob) btnPostJob.addEventListener('click', openModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

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
            closeModal();
            renderJobs();
            alert('Đăng công việc thành công!');
        });
    }

    if (searchInput) searchInput.addEventListener('input', renderJobs);
    if (locationSelect) locationSelect.addEventListener('change', renderJobs);
    if (urgentCheck) urgentCheck.addEventListener('change', renderJobs);

    // Chạy lần đầu
    renderJobs();
});