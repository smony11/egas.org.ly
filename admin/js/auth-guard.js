// Auth Guard - تأمين الوصول وإدارة الصلاحيات
(function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole') || 'staff';
    const userName = localStorage.getItem('userName') || 'موظف';
    const currentPath = window.location.pathname;

    // 1. التحقق من حالة الدخول
    if (!isLoggedIn && !currentPath.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // 2. حماية الصفحات بناءً على الصلاحيات (RBAC)
    const adminPages = ['staff.html', 'statistics.html'];
    const filename = currentPath.split('/').pop();

    if (isLoggedIn && adminPages.includes(filename) && userRole !== 'admin') {
        alert('عذراً، هذه الصفحة مخصصة لمدير النظام فقط.');
        window.location.href = 'dashboard.html';
        return;
    }

    // تحديث واجهة المستخدم عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', () => {
        const nameDisp = document.getElementById('userNameDisplay');
        const roleDisp = document.getElementById('userRoleDisplay');
        const avatarDisp = document.getElementById('userAvatarText');

        if (nameDisp) nameDisp.innerText = userName;
        if (roleDisp) {
            const roleMap = { 'admin': 'مدير نظام', 'doctor': 'طبيب متخصص', 'receptionist': 'موظف استقبال', 'staff': 'موظف' };
            roleDisp.innerText = roleMap[userRole] || userRole;
        }
        if (avatarDisp) avatarDisp.innerText = userName.charAt(0).toUpperCase();

        // إخفاء العناصر المخصصة للمدراء فقط
        if (userRole !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
        }

        // إخفاء الميزات الطبية عن الاستقبال (اختياري ولكن محترف)
        if (userRole === 'receptionist') {
            document.querySelectorAll('.doc-admin-only').forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
        }

        // سكريبت الخروج الموحد
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
            });
        }
    });
})();
