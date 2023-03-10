// define o tempo de cada objeto
const timer = {
    pomodoro: 0,
    shortBreak: 5,
    longBreak: 10,
    longbreakInterval: 4,
    sessions: 0,
};

const mainButton = document.getElementById('id-btn');
const alterButton = document.getElementById('id-alter');

// ao clicar no botão 'COMEÇAR' a função  handleTimeChange() não fica visível
mainButton.addEventListener('click', () => {
    const action = mainButton.dataset.action;
    if (action === 'COMEÇAR') {
        startTimer();
    } else {
        stopTimer();
    }
    alterButton.classList.toggle('active')
});

const modeButtons = document.querySelector('#buttons');
modeButtons.addEventListener('click', handleMode);

const timeInput = document.querySelector('#time-input');
timeInput.addEventListener('change', handleTimeChange);

// Esta função calcula o tempo restante entre o tempo atual e um horário de término especificado.
function getRemainingTime(endTime) {
    const time = Date.parse(new Date());
    const total = Math.floor((endTime - time) / 1000);
    const minutes = Math.floor((total / 60) % 60);
    const seconds = total % 60;
    return {
        total,
        minutes,
        seconds,
    };
}

// esta função é responsável por alterar o tempo do pomodoro de acordo com o desejado
function handleTimeChange() {
    timer.pomodoro = timeInput.value;
    switchMode(timer.mode);
}

let count = 0;

// função responsável por começar o timer
function startTimer() {
    const counter = document.getElementById('id-counter');
    const endTime = Date.parse(new Date()) + timer.remainingTime.total * 1000;


    if (timer.mode === 'pomodoro') {
        timer.sessions++;
    }

    mainButton.dataset.action = 'PARAR';
    mainButton.textContent = 'PARAR';
    mainButton.classList.add('active');

    interval = setInterval(() => {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        if (timer.remainingTime.total <= 0) {
            clearInterval(interval);

            if (timer.mode === 'pomodoro') {
                count++;
                counter.textContent = count;

                if (timer.sessions % timer.longbreakInterval === 0) {
                    switchMode('longBreak');
                } else {
                    switchMode('shortBreak');
                }
            } else {
                switchMode('pomodoro');
            }

            if (Notification.permission === 'granted') {
                const text = timer.mode === 'pomodoro' ? 'Seu intervalo acabou!' : 'Tire um tempo para descansar';
                new Notification(text);
            }

            document.querySelector(`[data-sound="${timer.mode}"]`).play();

            startTimer();
        }
    }, 1000);
}

// Esta função para o temporizador, limpando o intervalo que está executando o temporizador.
function stopTimer() {
    clearInterval(interval);

    mainButton.dataset.action = 'COMEÇAR'
    mainButton.textContent = 'COMEÇAR';
    mainButton.classList.remove('active');
}

const min = document.getElementById('id-min');
const sec = document.getElementById('id-sec');
const progress = document.getElementById('id-progress');

// A esta função é responsável por atualizar o relógio da aplicação
function updateClock() {
    const { minutes, seconds } = timer.remainingTime;
    const mins = `${minutes}`.padStart(2, '0');
    const secs = `${seconds}`.padStart(2, '0');

    [min.textContent, sec.textContent] = [mins, secs];

    updateTitle();
    updateProgress();

}

function updateTitle() {
    const { minutes, seconds } = timer.remainingTime;
    const text = timer.mode === 'pomodoro' ? 'Volte ao trabalho!' : 'Hora de decansar';
    document.title = `${minutes}:${seconds} — ${text} `;
}

function updateProgress() {
    const { mode, remainingTime } = timer;
    progress.value = timer[mode] * 60 - remainingTime.total;
}

// indica qual modo deve ser ativado no temporizador
function switchMode(mode) {
    const { [mode]: minutes } = timer;
    timer.mode = mode;
    timer.remainingTime = {
        total: minutes * 60,
        minutes,
        seconds: 0,
    };

    const modeButtons = document.querySelectorAll('button[data-mode]');
    modeButtons.forEach(button => button.classList.toggle
        ('active', button.dataset.mode === mode));
    document.body.style.backgroundColor = `var(--${mode})`;
    updateClock();
}

function handleMode(event) {
    const { mode } = event.target.dataset;

    if (!mode) return;

    switchMode(mode);
    stopTimer();
}

// Permissão se o usuário deseja receber as notificações ou não
document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window && Notification.permission !== 'granted'
        && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Você será notificado toda vez que uma sessão iniciar')
            }
        });
    }
    switchMode('pomodoro')
});



