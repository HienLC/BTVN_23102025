document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('regName').value;
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];

            const userExists = users.some(user => user.username === username || user.email === email);
            if (userExists) {
                alert('Tên đăng nhập hoặc Email đã được sử dụng!');
                return;
            }

            const newUser = { name, username, email, password };
            users.push(newUser);

            localStorage.setItem('users', JSON.stringify(users));

            alert('Đăng ký thành công! Bạn sẽ được chuyển đến trang Đăng nhập.');
            window.location.href = 'index.html';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const identifier = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];

            const foundUser = users.find(user =>
                (user.username === identifier || user.email === identifier) && user.password === password
            );

            if (foundUser) {
                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                alert(`Xin chào, ${foundUser.name || foundUser.username}! Đăng nhập thành công.`);
                window.location.href = 'qlsv.html';
            } else {
                alert('Tên đăng nhập/Email hoặc Mật khẩu không đúng!');
            }
        });
    }

    const qlsvForm = document.getElementById('studentForm');
    const tableBody = document.querySelector('#studentTable tbody');

    if (qlsvForm) {
        if (!localStorage.getItem('currentUser')) {
            alert('Bạn cần đăng nhập để truy cập trang này.');
            window.location.href = 'index.html';
            return;
        }

        const btnAddMonHoc = document.getElementById('btnAddMonHoc');

        function formatDate(dateString) {
            if (!dateString) return '';
            const parts = dateString.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return dateString;
        }

        function renderStudentRow(student, index) {
            const newRow = tableBody.insertRow();
            newRow.setAttribute('data-index', index);
            newRow.innerHTML = `
                <td class="tenSv">${student.tenSv}</td>
                <td class="lop">${student.lop}</td>
                <td class="namSinh" data-full-date="${student.namSinhDate}">${formatDate(student.namSinhDate)}</td>
                <td class="gioiTinh">${student.gioiTinh}</td>
                <td class="monHoc" data-mon-values="${student.monHocValues.join('|')}">${student.monHocValues.join(', ')}</td>
                <td class="actions">
                    <button class="btn-action btn-sua">Sửa</button>
                    <button class="btn-action btn-xoa">Xóa</button>
                </td>
            `;
        }

        function loadStudents() {
            const students = JSON.parse(localStorage.getItem('students')) || [];
            tableBody.innerHTML = '';

            students.forEach((student, index) => {
                renderStudentRow(student, index);
            });
        }

        function loadOptions() {
            let monHocOptions = JSON.parse(localStorage.getItem('monHocOptions')) || ['Toán', 'Lý', 'Hóa'];
            let lopOptions = JSON.parse(localStorage.getItem('lopOptions')) || ['A', 'B', 'C'];
            localStorage.setItem('monHocOptions', JSON.stringify(monHocOptions));
            localStorage.setItem('lopOptions', JSON.stringify(lopOptions));

            const monHocGroup = document.getElementById('monHocGroup');
            const currentBtnAddMonHoc = monHocGroup.querySelector('#btnAddMonHoc') || btnAddMonHoc;
            monHocGroup.innerHTML = '';

            monHocOptions.forEach(mon => {
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = `mon${mon.replace(/\s/g, '')}`;
                input.name = 'monHoc';
                input.value = mon;

                const label = document.createElement('label');
                label.htmlFor = input.id;
                label.textContent = mon;

                monHocGroup.appendChild(input);
                monHocGroup.appendChild(label);
            });
            monHocGroup.appendChild(currentBtnAddMonHoc);

            const lopSelect = document.getElementById('lopSelect');
            lopSelect.innerHTML = '';
            lopOptions.forEach(lop => {
                const option = document.createElement('option');
                option.value = lop;
                option.textContent = lop;
                lopSelect.appendChild(option);
            });

            currentBtnAddMonHoc.removeEventListener('click', handleAddMonHoc);
            currentBtnAddMonHoc.addEventListener('click', handleAddMonHoc);

            const btnAddLop = document.getElementById('btnAddLop');
            btnAddLop.removeEventListener('click', handleAddLop);
            btnAddLop.addEventListener('click', handleAddLop);
        }

        function handleAddMonHoc() {
            const newMon = prompt("Nhập tên môn học bạn muốn thêm:");
            if (newMon && newMon.trim() !== "") {
                const cleanMon = newMon.trim();
                let monHocOptions = JSON.parse(localStorage.getItem('monHocOptions')) || [];

                if (!monHocOptions.includes(cleanMon)) {
                    monHocOptions.push(cleanMon);
                    localStorage.setItem('monHocOptions', JSON.stringify(monHocOptions));
                    loadOptions();
                    alert(`Đã thêm môn học: ${cleanMon}`);
                } else {
                    alert('Môn học này đã tồn tại!');
                }
            }
        }

        function handleAddLop() {
            const newLop = prompt("Nhập tên lớp bạn muốn thêm:");
            if (newLop && newLop.trim() !== "") {
                const cleanLop = newLop.trim().toUpperCase();
                let lopOptions = JSON.parse(localStorage.getItem('lopOptions')) || [];

                if (!lopOptions.includes(cleanLop)) {
                    lopOptions.push(cleanLop);
                    localStorage.setItem('lopOptions', JSON.stringify(lopOptions));
                    loadOptions();
                    document.getElementById('lopSelect').value = cleanLop;
                    alert(`Đã thêm lớp: ${cleanLop}`);
                } else {
                    alert('Lớp này đã tồn tại!');
                }
            }
        }

        qlsvForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const tenSv = document.getElementById('tenSv').value;
            const lop = document.getElementById('lopSelect').value;
            const namSinhDate = document.getElementById('namSinh').value;
            const gioiTinh = document.querySelector('input[name="gioiTinh"]:checked').value;
            const monHocCheckboxes = document.querySelectorAll('input[name="monHoc"]:checked');
            const monHocValues = Array.from(monHocCheckboxes).map(cb => cb.value);

            let students = JSON.parse(localStorage.getItem('students')) || [];
            const studentData = { tenSv, lop, namSinhDate, gioiTinh, monHocValues };
            const rowIndex = document.getElementById('editRowIndex').value;

            if (rowIndex !== "") {
                students[parseInt(rowIndex)] = studentData;
                document.getElementById('btnThemSv').textContent = "Thêm sinh viên";
                document.getElementById('editRowIndex').value = "";
                alert('Cập nhật sinh viên thành công!');
            } else {
                students.push(studentData);
                alert('Thêm sinh viên thành công!');
            }

            localStorage.setItem('students', JSON.stringify(students));
            loadStudents();
            qlsvForm.reset();

            document.getElementById('gioiTinhNam').checked = true;
            document.querySelectorAll('input[name="monHoc"]').forEach(cb => cb.checked = false);
        });

        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            const rowIndex = parseInt(row.getAttribute('data-index'));
            let students = JSON.parse(localStorage.getItem('students')) || [];

            if (target.classList.contains('btn-xoa')) {
                if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
                    students.splice(rowIndex, 1);
                    localStorage.setItem('students', JSON.stringify(students));
                    loadStudents();
                }
            } else if (target.classList.contains('btn-sua')) {
                const student = students[rowIndex];

                document.getElementById('tenSv').value = student.tenSv;
                document.getElementById('namSinh').value = student.namSinhDate;
                document.getElementById('lopSelect').value = student.lop;
                document.querySelector(`input[name="gioiTinh"][value="${student.gioiTinh}"]`).checked = true;

                loadOptions();
                document.querySelectorAll('input[name="monHoc"]').forEach(cb => {
                    cb.checked = student.monHocValues.includes(cb.value);
                });

                document.getElementById('btnThemSv').textContent = "Cập nhật sinh viên";
                document.getElementById('editRowIndex').value = rowIndex;
            }
        });

        loadOptions();
        loadStudents();
    }
});