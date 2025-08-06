const languageSelector = document.getElementById('language-selector');
let currentLang = 'en';
let jsonData = [];

// Загружаем JSON (можно заменить на fetch из блокчейна)
async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load JSON');
        jsonData = await response.json();
        updateSections();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Обновляем содержимое блоков
function updateSections() {
    jsonData.forEach(item => {
        const section = document.getElementById(item.id);
        if (section) {
            section.textContent = item.content[currentLang] || item.content['en'];
        }
    });
}

// При смене языка
languageSelector.addEventListener('change', () => {
    currentLang = languageSelector.value;
    updateSections();
});

fetchData();
