module.exports = {
  apps: [
    {
      name: 'portfolio-web',
      cwd: './apps/web',
      script: 'npm',
      args: 'run start -- --hostname 127.0.0.1 --port 3001',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/www/portfolio-v3/shared/logs/pm2-error.log',
      out_file: '/var/www/portfolio-v3/shared/logs/pm2-out.log',
      merge_logs: true,
    },
  ],
};
