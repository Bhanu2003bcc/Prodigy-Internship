let startTime, elapsedTime = 0, timerInterval;
let lapTimes = [];

const display = document.getElementById('display');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapsContainer = document.getElementById('laps');
const bestWorstContainer = document.getElementById('best-worst');

// Function to format time including milliseconds
function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return (
        (hours < 10 ? '0' : '') + hours + ':' +
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds + '.' +
        (milliseconds < 100 ? '0' : '') + (milliseconds < 10 ? '0' : '') + milliseconds
    );
}

// Update the display every millisecond
function updateDisplay() {
    display.innerText = formatTime(elapsedTime);
}

// Start the stopwatch
startButton.addEventListener('click', () => {
    if (!timerInterval) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 1);
    }
});

// Pause the stopwatch
pauseButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

// Reset the stopwatch
resetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    lapTimes = [];
    updateDisplay();
    lapsContainer.innerHTML = '';
    bestWorstContainer.innerHTML = '';
});

// Record a lap time
lapButton.addEventListener('click', () => {
    if (timerInterval) {
        const lapTime = elapsedTime;
        lapTimes.push(lapTime);
        const lapElement = document.createElement('div');
        const lapDuration = lapTimes.length === 1 ? lapTime : lapTime - lapTimes[lapTimes.length - 2];
        lapElement.innerText = `Lap ${lapTimes.length}: ${formatTime(lapTime)} (+${formatTime(lapDuration)})`;
        lapsContainer.appendChild(lapElement);
        updateBestWorstLaps();
    }
});

// Highlight best and worst laps
function updateBestWorstLaps() {
    if (lapTimes.length < 2) return;

    const lapDurations = lapTimes.map((time, index) =>
        index === 0 ? time : time - lapTimes[index - 1]
    );

    const minLapTime = Math.min(...lapDurations);
    const maxLapTime = Math.max(...lapDurations);

    bestWorstContainer.innerHTML = `
        <div class="best">Best Lap: ${formatTime(minLapTime)}</div>
        <div class="worst">Worst Lap: ${formatTime(maxLapTime)}</div>
    `;

    const lapElements = lapsContainer.children;
    lapDurations.forEach((duration, index) => {
        lapElements[index].classList.remove('best', 'worst');
        if (duration === minLapTime) {
            lapElements[index].classList.add('best');
        } else if (duration === maxLapTime) {
            lapElements[index].classList.add('worst');
        }
    });
}
