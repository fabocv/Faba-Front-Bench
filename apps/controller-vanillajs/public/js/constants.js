
const StateManager = (function() {
    _STATE_FRW = ['NOT ALLOWED','TEST PENDING', 'TESTING [1/2]', 'TESTING [2/2]', 'SELECT', 'SELECTED', ]
    _STATE_PILL = ['pill-not-allowed', 'pill-pending', 'pill-testing', 'pill-testing', 'pill-select', 'pill-selected']
    _STATE_COMPARISON = {
        fw1: null,
        fw2: null
    } 
    _isRunning = false

    _CURRENT_VERSUS_MODE = 'light'; // Por defecto comienza en Light

    _metricsConfig = [
        { label: 'Estabilidad (σ)', key: 'performance', subKey: 'stdDev' },
        { label: 'JS Bundle (KB)', key: 'network', subKey: 'jsBundleKB' },
        { label: 'FCP (ms)', key: 'performance', subKey: 'FCPms' },
        { label: 'FTTS (ms)', key: 'performance', subKey: 'FTTSms' },
        { label: 'Memoria (MB)', key: 'memory', subKey: 'jsHeapUsedMB' }
    ];

    _FRAMEWORKS = {
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
                },
            'react':
                {
                    phase: 1,
                    light: null,
                    heavy: null,
                    lightPort: 3001,
                    heavyPort: 3002,
                    timestamp: null,
                },
            'vue':
                {
                    phase: 0,
                    light: null,
                    heavy: null,
                    lightPort: 0,
                    heavyPort: 0,
                    timestamp: null,
                },
        }
    }

    return {
        // Getter (Dinámico)
        get: (key) => _state[key],
        
        // Setter controlado (Aquí puedes meter lógica de validación)
        set: (key, value) => {
            _state[key] = value;
            console.log(`State Change: ${key}`, _state[key]);
        },
        // Uso:
        //StateManager.updateFramework('react', { phase: 4, lastRun: new Date() });
        updateFramework: (id, payload) => {
            if (!_state.frameworks[id]) _state.frameworks[id] = {};
            Object.assign(_state.frameworks[id], payload);
        }
    }
    
});
