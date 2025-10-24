document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const emailOrPhone = document.getElementById('emailOrPhone').value;
    const password = document.getElementById('password').value;

    const validUsername = 'admin';
    const validPassword = '123456';

    if (emailOrPhone === validUsername && password === validPassword) {
        alert('Đăng nhập thành công! Chuyển hướng đến trang Quản lý sinh viên.');
        window.location.href = 'qlsv.html';
    } else {
        alert('Đăng nhập thất bại. Vui lòng kiểm tra lại Tên đăng nhập (admin) và Mật khẩu (123456).');
    }
});