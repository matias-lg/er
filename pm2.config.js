module.exports = {
    apps: [
        {
            name: 'erdoc playground',
            script: 'npm',
            args: 'start',
            instances: 2,
            exec_mode: 'cluster',
            env: {
                PORT: 3000
            }
        }
    ]
}
