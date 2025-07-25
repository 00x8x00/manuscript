// Элементы интерфейса
const mainScreen = document.getElementById('main-screen');
const ideasScreen = document.getElementById('ideas-screen');
const walletScreen = document.getElementById('wallet-screen');
const showIdeasBtn = document.getElementById('show-ideas-btn');
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const backButtons = document.querySelectorAll('.back-btn');

// Обработчики кнопок
showIdeasBtn.addEventListener('click', () => {
    mainScreen.style.display = 'none';
    ideasScreen.style.display = 'block';
    loadIdeas(); // Загружаем идеи
});

connectWalletBtn.addEventListener('click', () => {
    mainScreen.style.display = 'none';
    walletScreen.style.display = 'block';
});

// Возврат на главный экран
backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        ideasScreen.style.display = 'none';
        walletScreen.style.display = 'none';
        mainScreen.style.display = 'block';
    });
});

// Подключение кошелька
document.querySelectorAll('.wallet-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
        const walletType = this.dataset.wallet;
        try {
            if (walletType === 'phantom' && window.solana?.isPhantom) {
                const response = await window.solana.connect();
                alert(`Кошелёк подключен: ${response.publicKey.toString()}`);
            } else {
                alert('Установите Phantom Wallet!');
            }
        } catch (error) {
            console.error('Ошибка подключения:', error);
        }
    });
});

// Загрузка идей (заглушка)
function loadIdeas() {
    const ideas = [
        "Идея 1",
        " Идея 2",
        "Идея 3"
    ];
    
    const ideasList = document.getElementById('ideas-list');
    ideasList.innerHTML = ideas.map(idea => `
        <div class="idea-item">
            <p>${idea}</p>
            <button class="like-btn">♡ 0</button>
        </div>
    `).join('');
}

