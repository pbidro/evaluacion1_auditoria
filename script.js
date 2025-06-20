function initWindows() {
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const win = document.getElementById(icon.dataset.window);
            if (win) win.style.display = 'block';
        });
    });
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.window').style.display = 'none';
        });
    });
    dragWindows();
    updateClock();
    setInterval(updateClock, 1000);
    drawCharts();
}

function dragWindows() {
    document.querySelectorAll('.window').forEach(win => {
        const bar = win.querySelector('.title-bar');
        let offsetX, offsetY, dragging = false;
        bar.addEventListener('mousedown', (e) => {
            dragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (dragging) {
                win.style.left = (e.clientX - offsetX) + 'px';
                win.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', () => dragging = false);
    });
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}

function drawCharts() {
    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: { labels: ['Ene', 'Feb'], datasets: [{ label: 'Sistema contable', data: [100, 200], backgroundColor: 'blue' }] },
        options: { responsive: false }
    });
    new Chart(ctx2, {
        type: 'bar',
        data: { labels: ['Ene', 'Feb'], datasets: [{ label: 'Sistema principal', data: [90, 250], backgroundColor: 'green' }] },
        options: { responsive: false }
    });
}

window.onload = initWindows;
