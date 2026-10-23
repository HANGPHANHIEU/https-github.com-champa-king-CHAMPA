document.addEventListener('DOMContentLoaded', () => {
    // Elements giao diện sẵn có
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    const urgentCheck = document.getElementById('urgentCheck');
    const btnPostJob = document.getElementById('btnPostJob');
    const jobListContainer = document.getElementById('jobList');

    // Elements cho Modal Đăng Việc
    const postJobModal = document.getElementById('postJobModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const postJobForm = document.getElementById('postJobForm');

    // Khởi tạo mảng lưu công việc (Lấy từ LocalStorage nếu có)
    let jobsList = JSON.parse(localStorage.getItem('my_jobs_list')) || [
        { id: 1, title: 'Nhân viên Phục vụ Bán thời gian', location: 'TP.HCM', salary: '25k - 30k/giờ', isUrgent: true },
        { id: 2, title: 'Nhân viên Thiết kế đồ họa (Graphic Designer)', location: 'Hà Nội', salary: '12 - 15 triệu', isUrgent: false }
    ];

    // --- 1. HIỂN THỊ DANH SÁCH CÔNG VIỆC RA MÀN HÌNH ---
    function renderJobs() {
        if (!jobListContainer) return;
        jobListContainer.innerHTML = '';

        if (jobsList.length === 0) {
            jobListContainer.innerHTML = '<p class="text-center text-slate-400 py-8">Chưa có công việc nào được đăng.</p>';
            return;
        }

        jobsList.forEach(job => {
            const jobCard = createJobCardElement(job);
            jobListContainer.appendChild(jobCard);
        });
    }

    // Hàm tạo phần tử HTML cho từng Job Card
    function createJobCardElement(job, isNew = false) {
        const card = document.createElement('div');
        
        // Thêm animation hiệu ứng xuất hiện cho công việc mới đăng
        const animationClass = isNew ? 'animate-bounce border-emerald-500 shadow-md ring-2 ring-emerald-200' : 'border-slate-200';
        
        card.className = `p-4 bg-white rounded-xl border transition-all duration-300 flex justify-between items-center hover:shadow-md ${animationClass}`;
        card.setAttribute('data-id', job.id);

        card.innerHTML = `
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <h3 class="font-bold text-slate-800 text-lg">${job.title}</h3>
                    ${job.isUrgent ? '<span class="px-2 py-0.5 text-xs bg-red-100 text-red-600 font-bold rounded-full">GẤP</span>' : ''}
                </div>
                <div class="flex items-center gap-4 text-sm text-slate-500">
                    <span>📍 ${job.location}</span>
                    <span>💰 ${job.salary}</span>
                </div>
            </div>
            <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition shadow-sm">
                Ứng tuyển
            </button>
        `;
        return card;
    }

    // --- 2. XỬ LÝ ĐÓNG / MỞ MODAL ĐĂNG VIỆC ---
    const openModal = () => postJobModal?.classList.remove('hidden'), postJobModal?.classList.add('flex');
    const closeModal = () => {
        postJobModal?.classList.add('hidden');
        postJobModal?.classList.remove('flex');
        postJobForm?.reset(); // Xóa sạch dữ liệu đã nhập trên form
    };

    if (btnPostJob) btnPostJob.addEventListener('click', openModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    // --- 3. XỬ LÝ SỰ KIỆN ĐĂNG CÔNG VIỆC MỚI (SUBMIT FORM) ---
    if (postJobForm) {
        postJobForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Lấy thông tin người dùng điền vào
            const newJob = {
                id: Date.now(),
                title: document.getElementById('jobTitleInput').value.trim(),
                location: document.getElementById('jobLocationInput').value,
                salary: document.getElementById('jobSalaryInput').value.trim() || 'Thỏa thuận',
                isUrgent: document.getElementById('jobUrgentInput').checked
            };

            // 1. Lưu vào danh sách dữ liệu
            jobsList.unshift(newJob); // Đưa lên đầu mảng
            localStorage.setItem('my_jobs_list', JSON.stringify(jobsList)); // Lưu vào trình duyệt

            // 2. Tạo phần tử và chèn ngay lên đầu danh sách giao diện
            const newCard = createJobCardElement(newJob, true);
            jobListContainer.prepend(newCard);

            // Tắt hiệu ứng viền sáng nổi bật sau 2 giây
            setTimeout(() => {
                newCard.classList.remove('animate-bounce', 'border-emerald-500', 'shadow-md', 'ring-2', 'ring-emerald-200');
                newCard.classList.add('border-slate-200');
            }, 2000);

            // 3. Tắt modal
            closeModal();
        });
    }

    // --- 4. CÁC TÍNH NĂNG GIAO DIỆN KHÁC (GIỮ NGUYÊN) ---
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => {
                b.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
                b.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            });
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            clickedBtn.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log('Đang tìm kiếm:', e.target.value);
        });
    }

    if (locationSelect) {
        locationSelect.addEventListener('change', (e) => {
            console.log('Đã chọn khu vực:', e.target.value);
        });
    }

    if (urgentCheck) {
        urgentCheck.addEventListener('change', (e) => {
            console.log('Lọc chỉ việc gấp:', e.target.checked);
        });
    }

    // Khởi chạy render danh sách lần đầu khi tải trang
    renderJobs();
});