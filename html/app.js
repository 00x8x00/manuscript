async function loadData(lang) {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    const sections = ['section-1', 'section-2', 'section-3'];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && data.languages[lang] && data.languages[lang][id]) {
        el.innerText = data.languages[lang][id];
      } else if (el) {
        el.innerText = 'Content not available';
      }
    });
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// Вызывается при загрузке и смене языка
document.getElementById('language-selector').addEventListener('change', (e) => {
  loadData(e.target.value);
});

// При загрузке страницы
loadData(document.getElementById('language-selector').value);
