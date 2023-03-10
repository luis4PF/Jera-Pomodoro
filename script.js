// define o tempo de cada objeto
const timer = {
    pomodoro: 0.1,
    shortBreak: 0.1,
    longBreak: 0.1,
    longbreakInterval: 4,
    sessions: 0,
};

let interval;

const mainButton = document.getElementById('id-btn');
const alterButton = document.getElementById('id-alter');

// ao clicar no botão 'COMEÇAR' a função  handleTimeChange() não fica visível
mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    if (action === 'COMEÇAR') {
        startTimer();
        alterButton.classList.add('active')
    } else {
        stopTimer();
        alterButton.classList.remove('active')
    }
});

const modeButtons = document.querySelector('#buttons');
modeButtons.addEventListener('click', handleMode);

const timeInput = document.querySelector('#time-input');
timeInput.addEventListener('change', handleTimeChange);

// Esta função calcula o tempo restante entre o tempo atual e um horário de término especificado.
function getRemainingTime(endTime) {
    const time = Date.parse(new Date());
    const different = endTime - time;

    const total = Number.parseInt(different / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

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
    let { total } = timer.remainingTime;
    const counter = document.getElementById('id-counter');
    const endTime = Date.parse(new Date()) + total * 1000;


    if (timer.mode === 'pomodoro') timer.sessions++;

    mainButton.dataset.action = 'PARAR';
    mainButton.textContent = 'PARAR';
    mainButton.classList.add('active');

    interval = setInterval(function () {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);

            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.sessions % timer.longbreakInterval === 0) {
                        switchMode('longBreak');
                    } else {
                        switchMode('shortBreak');
                    }
                    break;
                default:
                    switchMode('pomodoro');
            }

            if (Notification.permission === 'granted') {
                const text =
                    timer.mode === 'pomodoro' ? 'Seu intervalo acabou!' : 'Tire um tempo para descansar';
                new Notification(text);
            }

            document.querySelector(`[data-sound="${timer.mode}"]`).play();

            count++;
            counter.textContent = count;

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

function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('id-min');
    const sec = document.getElementById('id-sec');
    min.textContent = minutes;
    sec.textContent = seconds;

    const text =
        timer.mode === 'pomodoro' ? 'Volte ao trabalho' : 'Hora de descansar';
    document.title = `${minutes}:${seconds} — ${text}`;

    const progress = document.getElementById('id-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };

    document
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
    document.getElementById('id-progress').setAttribute('max', timer.remainingTime.total);

    updateClock();
}

function handleMode(event) {
    const { mode } = event.target.dataset;

    if (!mode) return;

    switchMode(mode);
    stopTimer();
}

document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window) {
        if (
            Notification.permission !== 'granted' &&
            Notification.permission !== 'denied'
        ) {
            Notification.requestPermission().then(function (permission) {
                if (permission === 'granted') {
                    new Notification(
                        'Voce será notificado toda vez que uma sessão iniciar'
                    );
                }
            });
        }
    }

    switchMode('pomodoro');
});



