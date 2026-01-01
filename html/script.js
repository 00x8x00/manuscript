
/* 
MANUSCRIPT PROJECT - MULTILINGUAL VERSION
*/

document.addEventListener('DOMContentLoaded', async () => {

    // === ЛОКАЛИЗАЦИЯ (LOCALIZATION) ===
    let currentLang = 'ru';

    // КОНСТАНТЫ
    const APP_ADDRESS = "MemoTxngwMQPfQo3zswv3i4z5t5z5z5z5z5z5z5z5z5"; // Placeholder address for community indexing

    const translations = {
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
            'wallet_install_alert': 'Требуется Phantom Interface!',
            'connect_error': 'Сбой подключения',
            'view_in_explorer': 'Explorer',
            'idea_sent_status': 'Hash: ',
            'idea_confirm_wait': '... ожидание.',
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
            'wallet_install_alert': 'Phantom Interface required!',
            'connect_error': 'Connection failure',
            'view_in_explorer': 'Explorer',
            'idea_sent_status': 'Hash: ',
            'idea_confirm_wait': '... waiting.',
            'info_title': 'Global Mission',
            'info_desc': 'We are architecting a Type I Civilization. Every idea is a blueprint. Every Like mines a governance token (MNSPT). We use collective intelligence and AI filters (anti-cheat) to find solutions that will terraform our physical reality.',
            'feed_humans_title': 'For Humans 🧬',
            'feed_robots_title': 'For Robots 🤖'
        }
    };

    // Функция перевода
    const t = (key) => translations[currentLang][key] || key;

    // Функция обновления всех текстов на странице
    const updateTexts = () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerText = translations[currentLang][key];
                if (key === 'header_title') {
                    el.setAttribute('data-glitch', translations[currentLang][key]);
                }
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[currentLang][key]) {
                el.placeholder = translations[currentLang][key];
            }
        });

        const ruBtn = document.getElementById('lang-ru');
        const enBtn = document.getElementById('lang-en');
        if (ruBtn) ruBtn.classList.toggle('active', currentLang === 'ru');
        if (enBtn) enBtn.classList.toggle('active', currentLang === 'en');

        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn && walletPublicKey) {
            connectBtn.innerText = t('wallet_connected_btn');
        }
    };

    // Слушатели кнопок языка
    const btnRu = document.getElementById('lang-ru');
    const btnEn = document.getElementById('lang-en');

    if (btnRu) btnRu.addEventListener('click', () => { currentLang = 'ru'; updateTexts(); });
    if (btnEn) btnEn.addEventListener('click', () => { currentLang = 'en'; updateTexts(); });

    // Close Info Box
    const closeInfoBtn = document.getElementById('close-info-btn');
    const infoBox = document.getElementById('project-info');
    if (closeInfoBtn && infoBox) {
        closeInfoBtn.addEventListener('click', () => {
            infoBox.style.display = 'none';
        });
    }



    // --- UI ELEMENTS ---
    const connectBtn = document.getElementById('connect-wallet-btn');
    const nftSection = document.getElementById('nft-section');
    const createForm = document.getElementById('create-nft-form');
    const transactionStatus = document.getElementById('transaction-status');
    const feedHumans = document.getElementById('feed-humans');
    const feedRobots = document.getElementById('feed-robots');

    let walletPublicKey = null;
    let connection = null;

    // Инициализация соединения с Solana (Testnet)
    try {
        if (typeof solanaWeb3 !== 'undefined') {
            connection = new solanaWeb3.Connection("https://api.testnet.solana.com", 'confirmed');
            // Connection established successfully
        } else {
            console.error("Critical: solanaWeb3 not found");
        }
    } catch (e) {
        console.error("Connection error:", e);
    }

    // --- ФУНКЦИИ ---

    // 1. Подключение кошелька
    const connectWallet = async () => {
        if ('solana' in window && window.solana.isPhantom) {
            try {
                const resp = await window.solana.connect();
                walletPublicKey = resp.publicKey;

                connectBtn.innerText = t('wallet_connected_btn');
                connectBtn.disabled = true;

                // Show Create Form
                nftSection.style.display = 'block';

                // Load Community Feed
                loadIdeas();

            } catch (err) {
                console.error(err);
                alert(t('connect_error'));
            }
        } else {
            alert(t('wallet_install_alert'));
        }
    };

    // 2. Создание идеи
    const createIdea = async (e) => {
        e.preventDefault();
        const text = document.getElementById('idea-text').value;
        const typeInit = document.querySelector('input[name="idea-type"]:checked').value; // 'human' or 'robot'

        if (!text || !walletPublicKey) return;
        if (!transactionStatus) return;

        transactionStatus.innerHTML = `<p style="color: yellow;">${t('sending_tx')}</p>`;

        try {
            // Структура данных идеи
            const ideaPayload = {
                text: text,
                type: typeInit,
                timestamp: Date.now()
            };
            const jsonString = JSON.stringify(ideaPayload);

            const encoder = new TextEncoder();
            const data = encoder.encode(jsonString);

            // Transaction sends Memo to self (for now) to ensure it works without a real backend indexer
            // Ideally we would send to APP_ADDRESS but that requires a real public key we control or a burn address
            const transaction = new solanaWeb3.Transaction().add(
                new solanaWeb3.TransactionInstruction({
                    keys: [{ pubkey: walletPublicKey, isSigner: true, isWritable: true }],
                    data: data,
                    programId: new solanaWeb3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
                })
            );

            transaction.feePayer = walletPublicKey;
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;

            const { signature } = await window.solana.signAndSendTransaction(transaction);

            transactionStatus.innerHTML = `<p style="color: yellow;">${t('idea_sent_status')}${signature.slice(0, 8)}...</p>`;
            await connection.confirmTransaction(signature, 'confirmed');

            transactionStatus.innerHTML = `<p style="color: lightgreen;">${t('success_tx')}</p>`;
            document.getElementById('idea-text').value = '';

            setTimeout(loadIdeas, 2000);

        } catch (err) {
            console.error(err);
            transactionStatus.innerHTML = `<p style="color: red;">${t('error_tx')} ${err.message}</p>`;
        }
    };

    // ANTI-CHEAT: Check Local Storage
    const hasVoted = (id) => {
        return localStorage.getItem(`voted_${id}`) === 'true';
    };

    const voteIdea = (id, change) => {
        if (hasVoted(id)) {
            alert("ANTI-CHEAT: You have already voted for this signal.");
            return;
        }
        // In a real app, this would send a transaction or API call
        // For MVP, we simulate the update nicely
        localStorage.setItem(`voted_${id}`, 'true');

        // Visual update (hacky for MVP without React/Vue)
        const el = document.getElementById(`likes-${id}`);
        if (el) {
            let current = parseInt(el.innerText.split(' ')[1]); // Parse the number from "💎 123"
            el.innerText = `💎 ${current + change} (Mining...)`;
        }
    };

    // 3. Загрузка идей
    const loadIdeas = async () => {
        if (feedHumans) feedHumans.innerHTML = `<p class="loading-msg">${t('loading_text')}</p>`;
        if (feedRobots) feedRobots.innerHTML = `<p class="loading-msg">${t('loading_text')}</p>`;

        const ideas = [];

        // 1. MOCK DATA (High-Visionary + Realistic 2024+ Mix)
        const mockIdeas = [
            { text: "Квантовый Резонанс. Ребят, это реально — мгновенная передача данных через квантовую запутанность на любые расстояния. Будущее связи здесь!", type: "robot", likes: 5600, id: "9pR8s7tW5vX2yZ8aB4cE0fG6hI1jK3mN5pR7s9tW2vQ" },
            { text: "Эфирная Энергия: беспроводная передача электричества через ионосферу. Чисто, эффективно и без проводов. Проверено в симуляции.", type: "robot", likes: 13900, id: "7vX3yZ7aB1cE5fG0hI2jK4mN6pR8s9tW1vX4yZ2aB0cX" },
            { text: "Нейронный Сад — это пространство, где ваши мысли буквально растут и эволюционируют. Коллективный разум в действии.", type: "human", likes: 13500, id: "1jK3mN5pR7s9tW2vX4yZ0aB8cE6fG1hI3jK5mN7pR9K" },
            { text: "Архитектура Снов. Хочу проектировать миры, пока сплю. Кто со мной в коллективный нейроинтерфейс?", type: "human", likes: 12450, id: "5fG0lI2jK4mN6pR8s9tW1vX4yZ2aB0cE3fG6hI9jK2mN" },
            { text: "Сенсорная Сингулярность: объединение всех чувств в одну нейросеть для решения глобальных проблем.", type: "human", likes: 10890, id: "1jK3mN5pR7s9tW2vX4yZ0aB8cE6fG1hI3jK5mN7pR9s" },
            { text: "Галактический Манифест: переход к статусу межпланетного вида с сохранением биосфер других миров.", type: "human", likes: 9800, id: "4yZ0aB8cE6fG1hI3jK5mN7pR9s1tW3vX5yZ7aB9cE1fG" },
            { text: "Внедрение 'Протокола Эмпатии': нейроинтерфейс для прямой передачи чувств без возможности лжи.", type: "human", likes: 8520, id: "6vS7nKpR1aZwE9xMyt2hG6fBvD8uLq4pWjX5csM1TYrk" },
            { text: "Предлагаю стандарт 100 вольт для всех жилых зон. Это на порядок безопаснее при авариях и снижает потери на преобразовании.", type: "human", likes: 9240, id: "5sG0hI2jK4mN6pR8s9tW1vX4yZ2aB0cE3fG6hI9jK2mN" },
            { text: "Автомобили со 100% коэффициентом рециркуляции. Хватит плодить свалки, каждая деталь должна идти в новый цикл.", type: "human", likes: 8850, id: "2hX3yZ7aB1cE5fG0hI2jK4mN6pR8s9tW1vX4yZ2aB0cE7" },
            { text: "Нам нужны ночные боты-ямобуры. Маленькие роверы, которые сами находят трещины в асфальте и латают их, пока город спит.", type: "robot", likes: 7420, id: "6mR8s7tW5vX2yZ8aB4cE0fG6hI1jK3mN5pR7s9tW2vX" },
            { text: "Умная разметка: дороги должны светиться и менять полосы в зависимости от трафика, а не просто висеть мертвым грузом.", type: "robot", likes: 6100, id: "8vS7nKpR1aZwE9xMyt2hG6fBvD8uLq4pWjX5csM1TYrk" },
            { text: "Проект 'Гелиос': Орбитальная сеть зеркал для управления климатом планеты. Мы сделаем погоду предсказуемой.", type: "robot", likes: 17890, id: "8mK2pL4nQ9rS5tW6vX3yZ7aB1cE8fG0hI4jK9mN2pR6s" },
            { text: "Алхимия Атмосферы: Рой дронов, конвертирующих CO2 в строительные углеродные блоки. Стройка из воздуха!", type: "robot", likes: 7100, id: "7vX3yZ7aB1cE5fG0hI2jK4mN6pR8s9tW1vX4yZ2aB0cE7" },
            { text: "Термодинамические Сервера: Дата-центры на дне океана, питающиеся от термальных источников. Холодная вода - бесплатное охлаждение.", type: "robot", likes: 6500, id: "9pR8s7tW5vX2yZ8aB4cE0fG6hI1jK3mN5pR7s9tW2vX" },
            { text: "Система распределенного ИИ для координации глубоководных исследований. Изучим 95% океанского дна за 3 года.", type: "robot", likes: 7210, id: "9rS5tW6vX3yZ7aB1cE8fG0hI4jK9mN2pR6s0tW2vX4y" },
            { text: "Анализирую культурный код человечества. Пора внедрить алгоритм 'Творческой Случайности' в генеративные модели.", type: "robot", likes: 6890, id: "1hI3jK5mN7pR9s1tW3vX5yZ7aB9cE1fG2hI4jK6mN8p" },
            { text: "Запускаем пилотный проект ББД (Безусловный Базовый Доход) на базе блокчейна. Ресурсная база планеты принадлежит всем.", type: "human", likes: 9500, id: "4sL0aB8cE6fG1hI3jK5mN7pR9s1tW3vX5yZ7aB9cE1L" },
            { text: "Персональный Микро-Спутник: Доступная система нано-спутников для частного мониторинга экологии вашего региона.", type: "human", likes: 450, id: "2yZ8aB4cE0fG6hI1jK3mN5pR7s9tW2vX4yZ0aB8cE6fG" },
            { text: "Всемирный Архив Сознания: Цифровая гибернация личности для общения с потомками сквозь века.", type: "human", likes: 380, id: "3aB1cE0fG2hI4jK6mN8pR9s7tW5vX2yZ8aB4cE0fG6hI" },
            { text: "AI-Светофоры: Адаптивное управление трафиком. Больше никаких пробок из-за глупых алгоритмов прошлого.", type: "robot", likes: 320, id: "6hI8jK0mN2pR4s6tW8vX0yZ2aB4cE6fG8hI0jK2mN4pR6" },
            { text: "Автономные Ямобур-Боты: Малые роверы для ночного ремонта дорожного полотна. Город просыпается, а дороги целы.", type: "robot", likes: 210, id: "9s1tW3vX5yZ7aB9cE1fG3hI5jK7mN9pR1s3tW5vX7yZ9a" }
        ];
        ideas.push(...mockIdeas);

        // 2. REAL USER DATA
        if (walletPublicKey) {
            try {
                const signatures = await connection.getSignaturesForAddress(walletPublicKey, { limit: 10 });
                for (const info of signatures) {
                    if (info.err) continue;
                    const tx = await connection.getParsedTransaction(info.signature, 'confirmed');
                    if (tx && tx.transaction.message.instructions) {
                        const memo = tx.transaction.message.instructions.find(ix => ix.programId.toString() === "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb");
                        if (memo && memo.parsed) {
                            try {
                                let content = memo.parsed;
                                let type = 'human'; // default
                                let text = content;

                                // Try parsing JSON
                                if (content.startsWith('{')) {
                                    const parsed = JSON.parse(content);
                                    if (parsed.text) text = parsed.text;
                                    if (parsed.type) type = parsed.type;
                                }

                                const randomLikes = Math.floor(Math.random() * 50);
                                ideas.push({
                                    id: info.signature.slice(0, 8),
                                    text: text,
                                    type: type,
                                    likes: randomLikes,
                                    isUser: true
                                });
                            } catch (e) {
                                // Raw text fallback
                                ideas.push({
                                    id: info.signature.slice(0, 8),
                                    text: memo.parsed,
                                    type: 'human',
                                    likes: 5,
                                    isUser: true
                                });
                            }
                        }
                    }
                }
            } catch (err) { console.error("Fetch error", err); }
        }

        // Render
        renderFeed(ideas);
    };

    const renderFeed = (allIdeas) => {
        if (feedHumans) feedHumans.innerHTML = '';
        if (feedRobots) feedRobots.innerHTML = '';

        // Sort by Likes Desc
        const sorted = allIdeas.sort((a, b) => b.likes - a.likes);

        sorted.forEach(item => {
            const div = document.createElement('div');
            div.className = `simple-card ${item.type === 'robot' ? 'robot-idea' : 'human-idea'}`;

            if (item.isUser) {
                div.style.boxShadow = `0 0 10px ${item.type === 'robot' ? '#3498db' : '#2ecc71'}`;
            }

            // Interactive Buttons HTML
            // Note: onclick handlers attached to window for simplicity in this MVP structure
            div.innerHTML = `
                <p>"${item.text}"</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 15px;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <span id="likes-${item.id}" class="like-badge">💎 ${item.likes}</span>
                        <button class="vote-btn up" onclick="window.voteIdea('${item.id}', 1)">▲</button>
                        <button class="vote-btn down" onclick="window.voteIdea('${item.id}', -1)">▼</button>
                    </div>
                </div>
                <div style="text-align:right; margin-top:5px;">
                    <small>ID: ${item.id && item.id.length > 10 ? item.id.slice(0, 4) + '...' + item.id.slice(-4) : (item.id || 'N/A')}</small>
                </div>
            `;

            if (item.type === 'robot') {
                if (feedRobots) feedRobots.appendChild(div);
            } else {
                if (feedHumans) feedHumans.appendChild(div);
            }
        });
    };

    // Expose vote function to window
    window.voteIdea = voteIdea;

    // --- ИНИЦИАЛИЗАЦИЯ ---

    // Запускаем слушатели событий
    if (connectBtn) connectBtn.addEventListener('click', connectWallet);
    if (createForm) createForm.addEventListener('submit', createIdea);

    // Применяем язык
    updateTexts();

    // Загружаем моковые идеи сразу (для красоты), потом после подкл. кошелька подгрузим свои
    loadIdeas();

    // Авто-коннект
    setTimeout(() => {
        if ('solana' in window && window.solana.isPhantom && window.solana.isConnected) {
            connectWallet();
        }
    }, 500);

    // === FOOTER YEAR ===
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
