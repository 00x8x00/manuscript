/* 
   MODULE: UI (User Interface)
   Управление переводом, кнопками и визуализацией
*/

window.App.ui = {
    // Словари переводов
    translations: {
        'ru': {
            'header_title': 'MANUSCRIPT PROJECT',
            'connect_wallet_btn': 'Подключить',
            'wallet_connected_btn': 'Подключено',
            'not_connected': 'Оффлайн',
            'create_idea_title': 'Следующий Шаг Эволюции',
            'idea_placeholder': 'Какую глобальную проблему нам нужно решить?',
            'mint_btn': 'Записать в Историю',
            'community_ideas_title': 'Метрики Цивилизации',
            'loading_text': 'Сканирование...',
            'sending_tx': 'Синхронизация...',
            'success_tx': 'Данные внесены в блокчейн.',
            'error_tx': 'Ошибка протокола: ',
            'waiting_confirm': 'Подтверждение узлов...',
            'no_ideas': 'Нет данных.',
            'connect_error': 'Сбой подключения',
            'idea_sent_status': 'Hash: ',
            'info_title': 'Global Mission',
            'info_desc': 'Мы строим архитектуру Цивилизации I типа. Каждая идея — это чертеж будущего. Каждый Лайк майнит токен управления (MNSPT). Мы используем коллективный разум и AI-фильтры (anti-cheat) для поиска решений, способных изменить физическую реальность планеты.',
            'feed_humans_title': 'Для Людей 🧬',
            'feed_robots_title': 'Для Роботов 🤖'
        },
        'en': {
            'header_title': 'MANUSCRIPT PROJECT',
            'connect_wallet_btn': 'Connect',
            'wallet_connected_btn': 'Online',
            'not_connected': 'Offline',
            'create_idea_title': 'Next Evolutionary Step',
            'idea_placeholder': 'What global problem must be solved?',
            'mint_btn': 'Record to History',
            'community_ideas_title': 'Civilization Metrics',
            'loading_text': 'Scanning...',
            'sending_tx': 'Syncing...',
            'success_tx': 'Data recorded on-chain.',
            'error_tx': 'Protocol Error: ',
            'waiting_confirm': 'Confirming nodes...',
            'no_ideas': 'No data.',
            'connect_error': 'Connection failure',
            'idea_sent_status': 'Hash: ',
            'info_title': 'Global Mission',
            'info_desc': 'We are architecting a Type I Civilization. Every idea is a blueprint. Every Like mines a governance token (MNSPT).',
            'feed_humans_title': 'For Humans 🧬',
            'feed_robots_title': 'For Robots 🤖'
        }
    },

    // Функция перевода
    t: function (key) {
        return this.translations[window.App.state.currentLang][key] || key;
    },

    // Обновление всех текстов на странице
    updateTexts: function () {
        const lang = window.App.state.currentLang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[lang][key]) {
                el.innerText = this.translations[lang][key];
                if (key === 'header_title') el.setAttribute('data-glitch', this.translations[lang][key]);
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (this.translations[lang][key]) el.placeholder = this.translations[lang][key];
        });

        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn && window.App.state.walletPublicKey) {
            connectBtn.innerText = this.t('wallet_connected_btn');
            connectBtn.style.opacity = '0.8';
            connectBtn.disabled = true;
        }

        document.getElementById('lang-ru')?.classList.toggle('active', lang === 'ru');
        document.getElementById('lang-en')?.classList.toggle('active', lang === 'en');
    },

    // Отрисовка ленты идей
    renderFeed: function (allIdeas) {
        const feedHumans = document.getElementById('feed-humans');
        const feedRobots = document.getElementById('feed-robots');

        if (!feedHumans || !feedRobots) return;

        feedHumans.innerHTML = '';
        feedRobots.innerHTML = '';

        const sorted = allIdeas.sort((a, b) => b.likes - a.likes);

        sorted.forEach(item => {
            const div = document.createElement('div');
            div.className = `simple-card ${item.type === 'robot' ? 'robot-idea' : 'human-idea'}`;
            if (item.isUser) div.style.boxShadow = `0 0 10px ${item.type === 'robot' ? '#00e5ff' : '#ff5e00'}`;

            div.innerHTML = `
                <p>"${item.text}"</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 10px;">
                    <span id="likes-${item.id}" class="like-badge">💎 ${item.likes}</span>
                    <button class="vote-btn up" onclick="window.App.ui.voteIdea('${item.id}', 1)">
                        <svg viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M12 3L4 11H9V21H15V11H20L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
                <div style="text-align:right; margin-top:5px;"><small>ID: ${item.id}</small></div>
            `;
            (item.type === 'robot' ? feedRobots : feedHumans).appendChild(div);
        });
    },

    // Голосование (Local Only)
    voteIdea: function (id, change) {
        if (localStorage.getItem(`voted_${id}`) === 'true') {
            alert("ANTI-CHEAT: Вы уже поддержали этот сигнал.");
            return;
        }
        localStorage.setItem(`voted_${id}`, 'true');
        const el = document.getElementById(`likes-${id}`);
        if (el) el.innerText = `💎 ${parseInt(el.innerText.split(' ')[1]) + change} (Mining...)`;
    },

    // Инициализация модуля UI
    init: function () {
        // Подписка на клики языков
        document.getElementById('lang-ru')?.addEventListener('click', () => {
            window.App.state.currentLang = 'ru';
            this.updateTexts();
        });
        document.getElementById('lang-en')?.addEventListener('click', () => {
            window.App.state.currentLang = 'en';
            this.updateTexts();
        });

        // Кнопка закрытия инфо
        document.getElementById('close-info-btn')?.addEventListener('click', () => {
            document.getElementById('project-info').style.display = 'none';
        });

        // Год в футере
        const yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        this.updateTexts();
    }
};
