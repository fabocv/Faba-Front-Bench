import { state } from "../core/state.js";
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts/+esm';
import { metricsVersus as metrics } from "../config/constants.js";

export function renderVersusDashboard(fw1, fw2) {
    if (!fw1 || !fw2) return;
    
    let winsFw1 = 0;
    let winsFw2 = 0;

    // 1. Calcular victorias antes de renderizar
    const versusMode = state.getVersusMode();
    metrics.forEach(m => {
        const val1 = state.getFrameworkData(fw1)[versusMode][m.path[0]][m.path[1]];
        const val2 = state.getFrameworkData(fw2)[versusMode][m.path[0]][m.path[1]];
        if (val1 < val2) winsFw1++; else winsFw2++;
    });

    // 2. Inyectar el Scoreboard
    const scoreboard = document.getElementById('versus-scoreboard');
    scoreboard.innerHTML = `
        <div class="score-vs">${fw1.toUpperCase()} VS ${fw2.toUpperCase()} - cold start (headless)
        </div>
        
    `;

    // 3. Inyectar contenedores de gráficos
    const grid = document.getElementById('versus-dashboard');
    grid.innerHTML = metrics.map(m => `<div class="chart-box" id="chart-${m.id}"></div>`).join('');

    // 4. Renderizar ApexCharts (con un pequeño delay para el DOM)
    setTimeout(() => {
        metrics.forEach(m => {
            const val1 = state.getFrameworkData(fw1)[versusMode][m.path[0]][m.path[1]];
            const val2 = state.getFrameworkData(fw2)[versusMode][m.path[0]][m.path[1]];

            new ApexCharts(document.querySelector(`#chart-${m.id}`), {
                series: [{
                    name: m.label,
                    data: [
                        { x: fw1.toUpperCase(), y: Number(val1.toFixed(2)) },
                        { x: fw2.toUpperCase(), y: Number(val2.toFixed(2)) }
                    ]
                }],
                chart: { type: 'bar', height: 160, width: '100%', toolbar: { show: false }, redrawOnWindowResize: true,animations: {enabled: true} },
                plotOptions: { bar: { horizontal: true, distributed: true, barHeight: '50%' } },
                colors: ['#00d1b2', '#7b61ff'],
                legend: { show: false },
                title: { text: `${m.label}`, style: { color: '#8b949e' , fontSize: '16px'} },
                subtitle: { text: m.subtitle, style: { color: '#8b949e' },
                    fontSize: '16px',
                    fontWeight: 400,
                    fontFamily: 'Inter, sans-serif'
                },
                tooltip: { theme: 'dark' },
                xaxis: { labels: { style: { colors: '#8b949e' } } },
                yaxis: { labels: { style: { colors: '#8b949e' } } }
            }).render();
        });
    }, 50);
    
}