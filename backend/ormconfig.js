const process = require('process');

const username = process.env.POSTGRES_USER || 'postgres';
const password = process.env.POSTGRES_PASSWORD || 'postgres';

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username,
  password,
  database: 'postgres',
  synchronize: process.env.NODE_ENV === 'development',
  dropSchema: false,
  logging: true,
  entities: [
    __dirname + '/src/**/*.entity.ts',
    __dirname + '/dist/**/*.entity.js',
  ],
  migrations: ['migrations/**/*.ts'],
  subscribers: ['subscriber/**/*.ts', 'dist/subscriber/**/.js'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'migrations',
    subscribersDir: 'subscriber',
  },
};
