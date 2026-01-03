/* 
   MODULE: AUTH (Authentication)
   Управление Web3Auth и подключением
*/

window.App.auth = {
    web3auth: null,
    initPromise: null,
    CLIENT_ID: "BLwcm5ZHxLBDSfryZMsbbU0gy8iKkEkF_LAic1bcUoGlRh5uys9YO0Tfv0gpSXiHbGbUWGtLGcwr4ayEfUmqqaE",

    // Инициализация Web3Auth
    init: async function () {
        const chainConfig = {
            chainNamespace: "solana",
            chainId: "0x2", // Testnet
            rpcTarget: "https://api.testnet.solana.com",
            displayName: "Solana Testnet",
            blockExplorer: "https://explorer.solana.com/?cluster=testnet",
            ticker: "SOL",
            tickerName: "Solana",
        };

        this.web3auth = new window.Modal.Web3Auth({
            clientId: this.CLIENT_ID,
            privateKeyProvider: new window.SolanaProvider.SolanaPrivateKeyProvider({ config: { chainConfig } }),
            web3AuthNetwork: "sapphire_devnet",
        });

        this.initPromise = this.web3auth.initModal();
        await this.initPromise;

        // Если уже были подключены — восстанавливаем сессию
        if (this.web3auth.connected) {
            await this.setupProvider();
        }
    },

    // Подключение (Вызывается по кнопке)
    connect: async function () {
        try {
            if (this.initPromise) await this.initPromise;
            if (!this.web3auth) throw new Error("Web3Auth not initialized");

            if (!this.web3auth.connected) {
                await this.web3auth.connect();
            }
            await this.setupProvider();
        } catch (err) {
            console.error("Auth Connect Error:", err);
        }
    },

    // Настройка провайдера Solana после входа
    setupProvider: async function () {
        try {
            const provider = this.web3auth.provider;
            const solanaWallet = new window.SolanaProvider.SolanaWallet(provider);
            const accounts = await solanaWallet.requestAccounts();

            // Сохраняем в глобальный стейт
            window.App.state.solanaWallet = solanaWallet;
            window.App.state.walletPublicKey = new solanaWeb3.PublicKey(accounts[0]);

            // Обновляем UI
            window.App.ui.updateTexts(); // Кнопка станет "Подключено"
            document.getElementById('nft-section').style.display = 'block';

            // Загружаем данные из блокчейна
            window.App.blockchain.loadIdeas();

        } catch (e) {
            console.error("Auth Setup Error:", e);
        }
    }
};
