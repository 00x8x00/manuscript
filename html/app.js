// Загружает и отображает данные для выбранного языка
async function loadData(lang) {
  try {
    const response = await fetch('data.json');

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const sections = ['section-1', 'section-2', 'section-3'];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return; // Если элемент не найден — пропускаем

      // Вставляем текст из данных или выводим сообщение по умолчанию
      el.textContent = data.languages?.[lang]?.[id] ?? 'Контент недоступен';
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

// Обновляет содержимое при смене языка
document.getElementById('language-selector').addEventListener('change', ({ target }) => {
  loadData(target.value);
});

// Загружаем данные при загрузке страницы
loadData(document.getElementById('language-selector').value);
