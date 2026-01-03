/* 
ПРОЕКТ MANUSCRIPT — МУЛЬТИЯЗЫЧНАЯ ВЕРСИЯ
Оптимизированный скрипт: Исправлен Race Condition, упрощена логика.
*/

document.addEventListener('DOMContentLoaded', async () => {

    // === КОНФИГУРАЦИЯ ===
    const WEB3AUTH_CLIENT_ID = "BLwcm5ZHxLBDSfryZMsbbU0gy8iKkEkF_LAic1bcUoGlRh5uys9YO0Tfv0gpSXiHbGbUWGtLGcwr4ayEfUmqqaE";
    const SOLANA_RPC = "https://api.testnet.solana.com";

    // Переменные состояния
    let currentLang = 'ru';
    let walletPublicKey = null;
    let web3auth = null;
    let solanaWallet = null;
    let connection = new solanaWeb3.Connection(SOLANA_RPC, 'confirmed');
    let initPromise = null; // Промис инициализации для предотвращения гонки

    // === ЛОКАЛИЗАЦИЯ ===
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
            'connect_error': 'Сбой подключения',
            'idea_sent_status': 'Hash: ',
            'info_title': 'Global Mission',
            'info_desc': 'Мы строим архитектуру Цивилизации I типа. Каждая идея — это чертеж будущего. Каждый Лайк майнит токен управления (MNSPT).',
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
    };

    const t = (key) => translations[currentLang][key] || key;

    const updateTexts = () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerText = translations[currentLang][key];
                if (key === 'header_title') el.setAttribute('data-glitch', translations[currentLang][key]);
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[currentLang][key]) el.placeholder = translations[currentLang][key];
        });

        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn && walletPublicKey) connectBtn.innerText = t('wallet_connected_btn');

        document.getElementById('lang-ru')?.classList.toggle('active', currentLang === 'ru');
        document.getElementById('lang-en')?.classList.toggle('active', currentLang === 'en');
    };

    // Слушатели интерфейса
    document.getElementById('lang-ru')?.addEventListener('click', () => { currentLang = 'ru'; updateTexts(); });
    document.getElementById('lang-en')?.addEventListener('click', () => { currentLang = 'en'; updateTexts(); });
    document.getElementById('close-info-btn')?.addEventListener('click', () => { document.getElementById('project-info').style.display = 'none'; });

    // === WEB3AUTH ИНИЦИАЛИЗАЦИЯ ===
    const initWeb3Auth = async () => {
        const chainConfig = {
            chainNamespace: "solana",
            chainId: "0x2", // Testnet
            rpcTarget: SOLANA_RPC,
            displayName: "Solana Testnet",
            blockExplorer: "https://explorer.solana.com/?cluster=testnet",
            ticker: "SOL",
            tickerName: "Solana",
        };

        web3auth = new window.Modal.Web3Auth({
            clientId: WEB3AUTH_CLIENT_ID,
            privateKeyProvider: new window.SolanaProvider.SolanaPrivateKeyProvider({ config: { chainConfig } }),
            web3AuthNetwork: "sapphire_devnet",
        });

        // Запуск инициализации и сохранение промиса
        initPromise = web3auth.initModal();
        await initPromise;

        if (web3auth.connected) {
            await setupWalletProvider();
        }
    };

    // Настройка провайдера после входа
    const setupWalletProvider = async () => {
        try {
            const provider = web3auth.provider;
            solanaWallet = new window.SolanaProvider.SolanaWallet(provider);
            const accounts = await solanaWallet.requestAccounts();
            walletPublicKey = new solanaWeb3.PublicKey(accounts[0]);

            const connectBtn = document.getElementById('connect-wallet-btn');
            if (connectBtn) {
                connectBtn.innerText = t('wallet_connected_btn');
                connectBtn.style.opacity = '0.8';
                connectBtn.disabled = true;
            }
            document.getElementById('nft-section').style.display = 'block';
            loadIdeas();
        } catch (e) {
            console.error("Setup Wallet Error:", e);
        }
    };

    // === ОСНОВНЫЕ ДЕЙСТВИЯ ===

    // Подключение кошелька (С ожиданием инициализации)
    const connectWallet = async () => {
        try {
            // Ждем завершения инициализации, если она еще идет
            if (initPromise) await initPromise;

            if (!web3auth) throw new Error("Web3Auth not initialized");

            if (!web3auth.connected) {
                await web3auth.connect();
            }

            await setupWalletProvider();

        } catch (err) {
            console.error("Connect Error:", err);
            // alert(t('connect_error') + ": " + err.message); // Отключил алерт чтобы не пугать юзера, только лог
        }
    };

    // Создание идеи (транзакция)
    const createIdea = async (e) => {
        e.preventDefault();
        const text = document.getElementById('idea-text').value;
        const typeInit = document.querySelector('input[name="idea-type"]:checked').value;
        const statusEl = document.getElementById('transaction-status');

        if (!text || !walletPublicKey || !solanaWallet) return;

        statusEl.innerHTML = `<p style="color: yellow;">${t('sending_tx')}</p>`;

        try {
            const data = new TextEncoder().encode(JSON.stringify({ text, type: typeInit, timestamp: Date.now() }));
            const transaction = new solanaWeb3.Transaction().add(
                new solanaWeb3.TransactionInstruction({
                    keys: [{ pubkey: walletPublicKey, isSigner: true, isWritable: true }],
                    data: data,
                    programId: new solanaWeb3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
                })
            );

            transaction.feePayer = walletPublicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

            const { signature } = await solanaWallet.signAndSendTransaction(transaction);
            statusEl.innerHTML = `<p style="color: yellow;">${t('idea_sent_status')}${signature.slice(0, 8)}...</p>`;

            await connection.confirmTransaction(signature, 'confirmed');
            statusEl.innerHTML = `<p style="color: lightgreen;">${t('success_tx')}</p>`;
            document.getElementById('idea-text').value = '';
            setTimeout(loadIdeas, 2000);

        } catch (err) {
            console.error("Tx Error:", err);
            statusEl.innerHTML = `<p style="color: red;">${t('error_tx')} ${err.message}</p>`;
        }
    };

    // Anti-Cheat Голосование
    window.voteIdea = (id, change) => {
        if (localStorage.getItem(`voted_${id}`) === 'true') {
            alert("ANTI-CHEAT: Вы уже поддержали этот сигнал.");
            return;
        }
        localStorage.setItem(`voted_${id}`, 'true');
        const el = document.getElementById(`likes-${id}`);
        if (el) el.innerText = `💎 ${parseInt(el.innerText.split(' ')[1]) + change} (Mining...)`;
    };

    // Загрузка идей
    const loadIdeas = async () => {
        const feedH = document.getElementById('feed-humans');
        const feedR = document.getElementById('feed-robots');
        if (feedH) feedH.innerHTML = `<p class="loading-msg">${t('loading_text')}</p>`;
        if (feedR) feedR.innerHTML = `<p class="loading-msg">${t('loading_text')}</p>`;

        const ideas = [
            { text: "Квантовый Резонанс. Мгновенная передача данных.", type: "robot", likes: 5600, id: "mock1" },
            { text: "Эфирная Энергия: беспроводное электричество.", type: "robot", likes: 13900, id: "mock2" },
            { text: "Скульптура из переработанного пластика.", type: "human", likes: 13500, id: "mock3" },
            { text: "Архитектура Снов. Коллективный нейроинтерфейс.", type: "human", likes: 12450, id: "mock4" },
            { text: "Сенсорная Сингулярность.", type: "human", likes: 10890, id: "mock5" },
            { text: "Протокол Эмпатии.", type: "human", likes: 8520, id: "mock6" },
            { text: "Стандарт 100 вольт.", type: "human", likes: 9240, id: "mock7" },
            { text: "Автомобили 100% рециркуляции.", type: "human", likes: 8850, id: "mock8" },
            { text: "Ночные боты-ямобуры.", type: "robot", likes: 7420, id: "mock9" },
            { text: "Умная разметка дорог.", type: "robot", likes: 6100, id: "mock10" },
        ];

        // Сканирование блокчейна
        if (walletPublicKey) {
            try {
                const signatures = await connection.getSignaturesForAddress(walletPublicKey, { limit: 10 });
                for (const info of signatures) {
                    if (info.err) continue;
                    const tx = await connection.getParsedTransaction(info.signature, 'confirmed');
                    const memo = tx?.transaction.message.instructions.find(ix => ix.programId.toString() === "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb");
                    if (memo && memo.parsed) {
                        let text = memo.parsed;
                        let type = 'human';
                        try {
                            const p = JSON.parse(text);
                            if (p.text) { text = p.text; type = p.type || 'human'; }
                        } catch { }
                        ideas.push({ id: info.signature.slice(0, 8), text, type, likes: Math.floor(Math.random() * 50), isUser: true });
                    }
                }
            } catch (e) { console.error("Blockchain Scan Error:", e); }
        }

        // Рендер
        feedH.innerHTML = ''; feedR.innerHTML = '';
        ideas.sort((a, b) => b.likes - a.likes).forEach(item => {
            const div = document.createElement('div');
            div.className = `simple-card ${item.type === 'robot' ? 'robot-idea' : 'human-idea'}`;
            if (item.isUser) div.style.boxShadow = `0 0 10px ${item.type === 'robot' ? '#00e5ff' : '#ff5e00'}`;
            div.innerHTML = `
                <p>"${item.text}"</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 10px;">
                    <span id="likes-${item.id}" class="like-badge">💎 ${item.likes}</span>
                    <button class="vote-btn up" onclick="window.voteIdea('${item.id}', 1)">
                        <svg viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M12 3L4 11H9V21H15V11H20L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
                <div style="text-align:right; margin-top:5px;"><small>ID: ${item.id}</small></div>
            `;
            (item.type === 'robot' ? feedR : feedH).appendChild(div);
        });
    };

    // Старт
    document.getElementById('connect-wallet-btn')?.addEventListener('click', connectWallet);
    document.getElementById('create-nft-form')?.addEventListener('submit', createIdea);

    updateTexts();
    loadIdeas();
    initWeb3Auth(); // Запуск инициализации в фоне

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
