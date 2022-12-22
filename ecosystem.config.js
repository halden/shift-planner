module.exports = {
  apps: [
    {
      name: 'shift-planner',
      script: './dist/main.js',
      node_args: '-r dotenv/config',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
