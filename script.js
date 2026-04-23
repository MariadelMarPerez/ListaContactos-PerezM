const contactForm = document.getElementById('contact-form');
const contactsList = document.getElementById('contacts-list');
const btnSubmit = document.getElementById('btn-submit');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');

let contacts = JSON.parse(localStorage.getItem('contacts_db')) || [];
let currentIdToDelete = null;

function render() {
    contactsList.innerHTML = '';
    contacts.forEach(c => {
        const icon = c.gender === 'Femenino' ? 'bi-person-fill text-pink-400' : 'bi-person-fill text-blue-400';
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <div class="card-header" onclick="toggleAccordion('${c.id}')">
                <span class="flex items-center gap-2"><i class="bi ${icon}"></i> <strong>${c.name}</strong></span>
                <div class="flex gap-2">
                    <button onclick="event.stopPropagation(); loadForEdit('${c.id}')" class="text-blue-400 hover:scale-110"><i class="bi bi-pencil-square"></i></button>
                    <button onclick="event.stopPropagation(); confirmDelete('${c.id}', '${c.name}')" class="text-red-400 hover:scale-110"><i class="bi bi-trash3-fill"></i></button>
                </div>
            </div>
            <div id="body-${c.id}" class="card-body">
                <p class="text-sm py-1"><i class="bi bi-telephone text-gray-400 mr-2"></i>${c.phone}</p>
                <p class="text-sm py-1"><i class="bi bi-geo-alt text-gray-400 mr-2"></i>${c.city}</p>
                <p class="text-sm py-1"><i class="bi bi-house text-gray-400 mr-2"></i>${c.address}</p>
            </div>
        `;
        contactsList.appendChild(card);
    });
}

function toggleAccordion(id) {
    const body = document.getElementById(`body-${id}`);
    body.classList.toggle('active');
}

function validate() {
    let isValid = true;
    ['name', 'phone', 'city', 'address'].forEach(id => {
        const input = document.getElementById(id);
        const error = input.nextElementSibling;
        if (!input.value.trim()) {
            error.style.display = 'block';
            isValid = false;
        } else {
            error.style.display = 'none';
        }
    });
    const gender = document.querySelector('input[name="gender"]:checked');
    document.getElementById('gender-error').style.display = gender ? 'none' : 'block';
    return isValid && !!gender;
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    btnSubmit.disabled = true;

    setTimeout(() => {
        const editId = document.getElementById('edit-id').value;
        const newContact = {
            id: editId || Date.now().toString(),
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            gender: document.querySelector('input[name="gender"]:checked').value
        };

        if (editId) {
            contacts = contacts.map(c => c.id === editId ? newContact : c);
            document.getElementById('modal-success').showModal();
        } else {
            contacts.push(newContact);
        }

        localStorage.setItem('contacts_db', JSON.stringify(contacts));
        contactForm.reset();
        document.getElementById('edit-id').value = '';
        btnText.innerHTML = '<i class="bi bi-person-plus-fill"></i> AÑADIR CONTACTO';
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
        btnSubmit.disabled = false;
        render();
    }, 1200);
});

window.loadForEdit = (id) => {
    const c = contacts.find(x => x.id === id);
    document.getElementById('edit-id').value = c.id;
    document.getElementById('name').value = c.name;
    document.getElementById('phone').value = c.phone;
    document.getElementById('city').value = c.city;
    document.getElementById('address').value = c.address;
    document.querySelector(`input[name="gender"][value="${c.gender}"]`).checked = true;
    btnText.innerHTML = '<i class="bi bi-check-circle-fill"></i> ACTUALIZAR';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.confirmDelete = (id, name) => {
    currentIdToDelete = id;
    document.getElementById('delete-msg').innerText = `¿Deseas eliminar a ${name}?`;
    document.getElementById('modal-confirm').showModal();
};

document.getElementById('confirm-delete').onclick = () => {
    contacts = contacts.filter(c => c.id !== currentIdToDelete);
    localStorage.setItem('contacts_db', JSON.stringify(contacts));
    document.getElementById('modal-confirm').close();
    document.getElementById('modal-delete-success').showModal(); // Modal de éxito final
    render();
};

render();