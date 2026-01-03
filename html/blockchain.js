/* 
   MODULE: BLOCKCHAIN
   Работа с Solana: чтение транзакций и отправка Memo
*/

window.App.blockchain = {
    connection: null,
    RPC_URL: "https://api.testnet.solana.com",
    PROGRAM_ID: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb",

    init: function () {
        if (typeof solanaWeb3 !== 'undefined') {
            this.connection = new solanaWeb3.Connection(this.RPC_URL, 'confirmed');
            window.App.state.connection = this.connection;
        }
    },

    // Загрузка идей (Mock + Blockchain)
    loadIdeas: async function () {
        const feedH = document.getElementById('feed-humans');
        const feedR = document.getElementById('feed-robots');

        // Показываем лоадеры
        if (feedH) feedH.innerHTML = `<p class="loading-msg">${window.App.ui.t('loading_text')}</p>`;
        if (feedR) feedR.innerHTML = `<p class="loading-msg">${window.App.ui.t('loading_text')}</p>`;

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

        const pubKey = window.App.state.walletPublicKey;

        // Если кошелек подключен — качаем реальные данные
        if (pubKey) {
            try {
                const signatures = await this.connection.getSignaturesForAddress(pubKey, { limit: 10 });
                for (const info of signatures) {
                    if (info.err) continue;
                    const tx = await this.connection.getParsedTransaction(info.signature, 'confirmed');
                    const memo = tx?.transaction.message.instructions.find(ix => ix.programId.toString() === this.PROGRAM_ID);

                    if (memo && memo.parsed) {
                        let text = memo.parsed;
                        let type = 'human';
                        try {
                            const p = JSON.parse(text);
                            if (p.text) { text = p.text; type = p.type || 'human'; }
                        } catch { }

                        ideas.push({
                            id: info.signature.slice(0, 8),
                            text,
                            type,
                            likes: Math.floor(Math.random() * 50),
                            isUser: true
                        });
                    }
                }
            } catch (e) {
                console.error("Blockchain Scan Error:", e);
            }
        }

        // Рендер через UI модуль
        window.App.ui.renderFeed(ideas);
    },

    // Создание новой записи
    createIdea: async function (e) {
        e.preventDefault();
        const text = document.getElementById('idea-text').value;
        const typeInit = document.querySelector('input[name="idea-type"]:checked').value;
        const statusEl = document.getElementById('transaction-status');
        const wallet = window.App.state.solanaWallet;
        const pubKey = window.App.state.walletPublicKey;

        if (!text || !pubKey || !wallet) return;

        statusEl.innerHTML = `<p style="color: yellow;">${window.App.ui.t('sending_tx')}</p>`;

        try {
            const data = new TextEncoder().encode(JSON.stringify({ text, type: typeInit, timestamp: Date.now() }));

            const transaction = new solanaWeb3.Transaction().add(
                new solanaWeb3.TransactionInstruction({
                    keys: [{ pubkey: pubKey, isSigner: true, isWritable: true }],
                    data: data,
                    programId: new solanaWeb3.PublicKey(this.PROGRAM_ID),
                })
            );

            transaction.feePayer = pubKey;
            transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

            const { signature } = await wallet.signAndSendTransaction(transaction);

            statusEl.innerHTML = `<p style="color: yellow;">${window.App.ui.t('idea_sent_status')}${signature.slice(0, 8)}...</p>`;

            await this.connection.confirmTransaction(signature, 'confirmed');

            statusEl.innerHTML = `<p style="color: lightgreen;">${window.App.ui.t('success_tx')}</p>`;
            document.getElementById('idea-text').value = '';

            setTimeout(() => this.loadIdeas(), 2000);

        } catch (err) {
            console.error("Tx Error:", err);
            statusEl.innerHTML = `<p style="color: red;">${window.App.ui.t('error_tx')} ${err.message}</p>`;
        }
    }
};
