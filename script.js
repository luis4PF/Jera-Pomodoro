const timer = {
    pomodoro: 1,
    shortBreak: 1,
    longbreak: 15,
    longbreakInterval: 4,
    sessions: 0,
};

let interval;

const mainButton = document.getElementById('js-btn')