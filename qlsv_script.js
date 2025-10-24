document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    const tableBody = document.querySelector('#studentTable tbody');
    const btnAddMonHoc = document.getElementById('btnAddMonHoc');
    const btnAddLop = document.getElementById('btnAddLop');
    const monHocGroup = document.getElementById('monHocGroup');
    const lopSelect = document.getElementById('lopSelect');
    const btnThemSv = document.getElementById('btnThemSv');
    const editRowIndexInput = document.getElementById('editRowIndex');

    function formatDate(dateString) {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateString;
    }

    btnAddMonHoc.addEventListener('click', () => {
        const newMon = prompt("Nhập tên môn học bạn muốn thêm:");
        if (newMon && newMon.trim() !== "") {
            const cleanMon = newMon.trim();
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `mon${cleanMon.replace(/\s/g, '')}`;
            input.name = 'monHoc';
            input.value = cleanMon;
            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.textContent = cleanMon;
            monHocGroup.insertBefore(input, btnAddMonHoc);
            monHocGroup.insertBefore(label, btnAddMonHoc);
        }
    });

    btnAddLop.addEventListener('click', () => {
        const newLop = prompt("Nhập tên lớp bạn muốn thêm:");
        if (newLop && newLop.trim() !== "") {
            const cleanLop = newLop.trim().toUpperCase();
            const option = document.createElement('option');
            option.value = cleanLop;
            option.textContent = cleanLop;
            lopSelect.appendChild(option);
            lopSelect.value = cleanLop;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const tenSv = document.getElementById('tenSv').value;
        const lop = lopSelect.value;
        const namSinhDate = document.getElementById('namSinh').value;
        const namSinhDisplay = formatDate(namSinhDate);
        const gioiTinh = document.querySelector('input[name="gioiTinh"]:checked').value;
        const monHocCheckboxes = document.querySelectorAll('input[name="monHoc"]:checked');
        const monHocValues = Array.from(monHocCheckboxes).map(cb => cb.value);
        const monHocDisplay = monHocValues.join(', ');
        const rowIndex = editRowIndexInput.value;
        if (rowIndex) {
            const row = tableBody.rows[parseInt(rowIndex)];
            row.querySelector('.tenSv').textContent = tenSv;
            row.querySelector('.lop').textContent = lop;
            row.querySelector('.namSinh').textContent = namSinhDisplay;
            row.querySelector('.namSinh').setAttribute('data-full-date', namSinhDate);
            row.querySelector('.gioiTinh').textContent = gioiTinh;
            row.querySelector('.monHoc').textContent = monHocDisplay;
            row.querySelector('.monHoc').setAttribute('data-mon-values', monHocValues.join('|'));
            btnThemSv.textContent = "Thêm sinh viên";
            editRowIndexInput.value = "";
        } else {
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td class="tenSv">${tenSv}</td>
                <td class="lop">${lop}</td>
                <td class="namSinh" data-full-date="${namSinhDate}">${namSinhDisplay}</td>
                <td class="gioiTinh">${gioiTinh}</td>
                <td class="monHoc" data-mon-values="${monHocValues.join('|')}">${monHocDisplay}</td>
                <td class="actions">
                    <button class="btn-action btn-sua">Sửa</button>
                    <button class="btn-action btn-xoa">Xóa</button>
                </td>
            `;
        }
        form.reset();
        document.getElementById('gioiTinhNam').checked = true;
        document.querySelectorAll('input[name="monHoc"]').forEach(cb => cb.checked = false);
        document.getElementById('monToan').checked = true;
    });
    tableBody.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('btn-xoa')) {
            if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
                target.closest('tr').remove();
            }
        } else if (target.classList.contains('btn-sua')) {
            const row = target.closest('tr');
            const rowIndex = Array.from(tableBody.rows).indexOf(row);
            const tenSv = row.querySelector('.tenSv').textContent;
            const lop = row.querySelector('.lop').textContent;
            const namSinhFull = row.querySelector('.namSinh').getAttribute('data-full-date');
            const gioiTinh = row.querySelector('.gioiTinh').textContent;
            const monHocValues = row.querySelector('.monHoc').getAttribute('data-mon-values').split('|');
            document.getElementById('tenSv').value = tenSv;
            document.getElementById('namSinh').value = namSinhFull;
            lopSelect.value = lop;
            document.querySelector(`input[name="gioiTinh"][value="${gioiTinh}"]`).checked = true;
            document.querySelectorAll('input[name="monHoc"]').forEach(cb => {
                cb.checked = monHocValues.includes(cb.value);
            });
            btnThemSv.textContent = "Cập nhật sinh viên";
            editRowIndexInput.value = rowIndex;
        }
    });

    document.querySelectorAll('.actions .btn-sua, .actions .btn-xoa').forEach(btn => {

    });
});