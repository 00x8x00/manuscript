/* 
   MAIN ENTRY POINT
   Инициализация приложения и связывание модулей
*/

// Глобальное состояние приложения
window.App = {
    state: {
        currentLang: 'ru',
        walletPublicKey: null,
        solanaWallet: null,
        connection: null
    },
    // Модули будут добавлены сюда из auth.js, ui.js, blockchain.js
    ui: null,
    auth: null,
    blockchain: null
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Manuscript App Initializing...");

    // 1. Инициализация UI (Язык, Кнопки)
    if (window.App.ui) window.App.ui.init();

    // 2. Инициализация Блокчейна (Connection)
    if (window.App.blockchain) window.App.blockchain.init();

    // 3. Загрузка контента (Mock Data)
    if (window.App.blockchain) window.App.blockchain.loadIdeas();

    // 4. Инициализация Web3Auth (Асинхронно в фоне)
    if (window.App.auth) window.App.auth.init();

    // 5. Связывание событий кнопок (которые требуют межмодульного взаимодействия)

    // Кнопка "Подключить" -> Auth Module
    const connectBtn = document.getElementById('connect-wallet-btn');
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            if (window.App.auth) window.App.auth.connect();
        });
    }

    // Форма "Создать" -> Blockchain Module
    const createForm = document.getElementById('create-nft-form');
    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            if (window.App.blockchain) window.App.blockchain.createIdea(e);
        });
    }
});
