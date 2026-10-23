// Xử lý sự kiện tương tác giao diện
document.addEventListener('DOMContentLoaded', () => {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const locationSelect = document.getElementById('locationSelect');
    const urgentCheck = document.getElementById('urgentCheck');
    const btnPostJob = document.getElementById('btnPostJob');
    const jobListContainer = document.getElementById('jobList'); // Container chứa danh sách việc làm

    // 1. Chuyển đổi trạng thái nút danh mục khi bấm
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

    // 2. Tính năng Thêm việc mới
    btnPostJob.addEventListener('click', () => {
        // Nhập thông tin việc mới (Bạn có thể thay đoạn này bằng Form / Modal nếu muốn)
        const title = prompt('Nhập tên công việc:');
        if (!title) return; // Hủy nếu không nhập tên

        const location = prompt('Nhập khu vực (Ví dụ: TP.HCM, Hà Nội):', 'TP.HCM');
        const salary = prompt('Nhập mức lương (Ví dụ: 10 - 15 triệu):', 'Thỏa thuận');
        const isUrgent = confirm('Đây có phải là công việc gấp không?');

        // Tạo dữ liệu công việc mới
        const newJob = {
            id: Date.now(),
            title: title,
            location: location || 'Toàn quốc',
            salary: salary || 'Thỏa thuận',
            isUrgent: isUrgent
        };

        // Thêm vào danh sách giao diện
        addJobToUI(newJob);
        alert('Thêm công việc thành công!');
    });

    // Hàm hiển thị công việc mới ra HTML
    function addJobToUI(job) {
        if (!jobListContainer) {
            console.log('Đã thêm công việc mới:', job);
            return;
        }

        const jobCard = document.createElement('div');
        jobCard.className = 'p-4 bg-white rounded-lg shadow border border-slate-200 flex justify-between items-center transition hover:shadow-md';
        jobCard.innerHTML = `
            <div>
                <div class="flex items-center gap-2">
                    <h3 class="font-bold text-slate-800 text-lg">${job.title}</h3>
                    ${job.isUrgent ? '<span class="px-2 py-0.5 text-xs bg-red-100 text-red-600 font-semibold rounded">GẤP</span>' : ''}
                </div>
                <p class="text-sm text-slate-500 mt-1">📍 ${job.location} | 💰 ${job.salary}</p>
            </div>
            <button class="px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800">
                Ứng tuyển
            </button>
        `;

        // Thêm việc mới lên đầu danh sách
        jobListContainer.prepend(jobCard);
    }

    // 3. Lắng nghe thay đổi tìm kiếm & bộ lọc
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
});