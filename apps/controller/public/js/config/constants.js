export const STATE_FRW = ['NOT ALLOWED','TEST PENDING', 'TESTING [1/2]', 'TESTING [2/2]', 'SELECT', 'SELECTED', ]
export const STATE_PILL = ['pill-not-allowed', 'pill-pending', 'pill-testing', 'pill-testing', 'pill-select', 'pill-selected']

export const metricsConfig = [
    { label: 'Stability (σ)', key: 'performance', subKey: 'stdDev' },
    { label: 'JS Bundle (KB)', key: 'network', subKey: 'jsBundleKB' },
    { label: 'FCP (ms)', key: 'performance', subKey: 'FCPms' },
    { label: 'FTTS (ms)', key: 'performance', subKey: 'FTTSms' },
    { label: 'Memory (MB)', key: 'memory', subKey: 'jsHeapUsedMB' }
];

export const metricsVersus = [
    { id: 'bundle', label: 'Bundle JS (KB)', path: ['network', 'jsBundleKB'], subtitle: `Weight: Initial payload cost for the end-user's data plan` },
    { id: 'fcp', label: 'FCP (ms)', path: ['performance', 'FCPms'], subtitle: 'Perception: Time until the first visual element is rendered.' },
    { id: 'ftts', label: 'FTTS (ms)', path: ['performance', 'FTTSms'] , subtitle: 'Interactivity: Time until the main thread remains stable for 300ms post-render.'},
    { id: 'memory', label: 'Memory (MB)', path: ['memory', 'jsHeapUsedMB'], subtitle: 'Memory: JavaScript heap used after initial stability is reached.'}
];

export const FRAMEWORKS = {
    UI: [
        { 
            id: 'angular', 
            name: 'Angular', 
            version: 'v21 / Zoneless', 
            desc: 'CSS vs MUI',
            color: '#3b82f6' 
        },
        { 
            id: 'react', 
            name: 'React', 
            version: '18 / SWC', 
            desc: 'DOM  vs MUI',
            color: '#3b82f6' 
        },
        { 
            id: 'vue', 
            name: 'Vue.js', 
            version: 'v3', 
            desc: 'Reactivity API + Vuetify',
            color: '#3b82f6' 
        },
        {
            id: 'svelte', 
            name: 'Svelte 5', 
            version: 'Runes / Vite', 
            desc: 'Compiled Reactivity',
            color: '#3b82f6'
        }
    ],
    state:
    {
        'angular': 
            {
                phase: 1,
                light: null,
                heavy: null,
                lightPort: 4201,
                heavyPort: 4202,
                timestamp: null,
                environment: null,
            },
        'react':
            {
                phase: 1,
                light: null,
                heavy: null,
                lightPort: 3001,
                heavyPort: 3002,
                timestamp: null,
                environment: null,
            },
        'vue':
            {
                phase: 1,
                light: null,
                heavy: null,
                lightPort: 3003,
                heavyPort: 3004,
                timestamp: null,
                environment: null,
            },
        'svelte':
            {
                phase: 1,
                light: null,
                heavy: null,
                lightPort: 3005,
                heavyPort: 3006,
                timestamp: null,
                environment: null,
            },
    }
}
