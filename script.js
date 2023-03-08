const timer = {
    pomodoro: 1,
    shortBreak: 1,
    longbreak: 15,
    longbreakInterval: 4,
    sessions: 0,
};

let interval;

const mainButton = document.getElementById('id-btn');
const alterButton = document.getElementById('id-alter');

mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    if (action == 'start') {
        startTimer();
        alterButton.classList.add('active')
    }
    else {
        stopTimer();
        alterButton.classList.remove('active')
    }
});

const modeButtons = document.querySelector('#buttons');
modeButtons.addEventListener('click', handleMode);

const timeInput = document.querySelector('#time-input');
timeInput.addEventListener('change', handleTimeChange);

function getRemainingTime(endTime) {
    const time = Date.parse(new Date());
    const different = endTime - time;

    const total = Number.parseInt(different / 1000, 10);
    const min = Number.parseInt((total / 60) % 60, 10);
    const sec = Number.parseInt(total % 60, 10);

    return {
        total,
        min,
        sec,
    };
}

function handleTimeChange() {
    timer.pomodoro = timeInput.ariaValueMax;
    switchMode(timer.mode);
}

let count = 0;

function startTimer() {
    let { total } = timer.RemainingTime;
    const counter = document.getElementById('id-counter');
    const endTime = Date.parse(new Date()) + total * 1000;


    if (timer.mode === 'pomodoro') timer.sessions++;

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(function () {
        timer.RemainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.RemainingTime.total;
        if (total <= 0) {
            clearInterval(interval);

            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.sessions % timer.longbreakInterval === 0) {
                        switchMode('longBreak');
                    }
                    else {
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

            counterCount++;
            counter.textContent = count;

            startTimer();
        }
    }, 1000);
}