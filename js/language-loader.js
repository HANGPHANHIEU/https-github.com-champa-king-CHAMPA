// FILE LOADER ĐỘNG: TỰ TẠO VÀ GẮN NÚT ĐỔI NGÔN NGỮ VÀO HEADER
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tìm vị trí trên header để chèn nút bấm (tìm chữ "Hoa hồng 1%" hoặc khu vực nút bên phải)
    const targetArea = document.querySelector('header .max-w-4xl > div:last-child') || document.querySelector('header');
    if (!targetArea) return;

    // 2. Tạo phần tử nút bấm giao diện
    const langWrapper = document.createElement('div');
    langWrapper.id = 'dynamicLangWrapper';
    const currentLang = localStorage.getItem('app_language') || 'vi';

    langWrapper.innerHTML = `
        <button type="button" id="realLangBtn" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-300 shadow-sm">
            <i class="fa-solid fa-globe text-teal-600"></i> 
            <span id="realLangText">${currentLang === 'vi' ? 'EN' : 'VN'}</span>
        </button>
    `;

    // Chèn lên đầu tiên của cụm bên phải header
    targetArea.insertBefore(langWrapper, targetArea.firstChild);

    // 3. Gắn sự kiện bấm trực tiếp vào nút vừa tạo
    document.getElementById('realLangBtn').addEventListener('click', (e) => {
        e.preventDefault();
        let storedLang = localStorage.getItem('app_language') || 'vi';
        let newLang = storedLang === 'vi' ? 'en' : 'vi';
        
        // Lưu lại và tải lại trang để chuyển đổi ngôn ngữ mượt mà
        localStorage.setItem('app_language', newLang);
        location.reload();
    });
});