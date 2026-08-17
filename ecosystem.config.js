module.exports = {
  apps: [
    {
      name: 'portfolio-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'portfolio-backend',
      script: 'venv/bin/python',
      args: '-m uvicorn app:app --host 0.0.0.0 --port 8787',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '250M',
      env: {
        PYTHONUNBUFFERED: '1'
      }
    }
  ]
};
