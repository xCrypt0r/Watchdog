module.exports = {
    apps: [
        {
            name: 'Watchdog',
            namespace: 'Watchdog',
            script: 'dist/index.js',
            node_args: '--no-deprecation',
            interpreter: 'node',
            watch: false,
            max_memory_restart: '16G',
            min_uptime: 5000,
            max_restarts: 10,
            log_date_format: 'YYYY-MM-DD HH:mm:ss'
        }
    ]
};
