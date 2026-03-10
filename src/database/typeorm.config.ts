import '../load-env';
import { SnakeNamingStrategy } from '../snake-naming.strategy';
import * as config from 'config';
import { UserSubscriber } from '../entity-subscribers';
import { DataSource } from 'typeorm';

const fileConfig = config.get<any>('db') || {};
const rawHost = process.env.DB_HOST ?? fileConfig.host;
// Avoid using environment name (e.g. "Development") as DB hostname
const resolvedHost =
  rawHost === 'Development' || rawHost === 'development'
    ? 'localhost'
    : rawHost;
const finalDbConfig = {
  ...fileConfig,
  host: resolvedHost,
  port: Number(process.env.DB_PORT ?? fileConfig.port),
  username: process.env.DB_USERNAME ?? fileConfig.username,
  password: process.env.DB_PASSWORD ?? fileConfig.password,
  database: process.env.DB_NAME ?? fileConfig.database,
};

console.log('DB CONFIG: ', {
  type: finalDbConfig.type,
  host: finalDbConfig.host,
  port: finalDbConfig.port,
  username: finalDbConfig.username,
  password: finalDbConfig.password,
  database: finalDbConfig.database,
  env: process.env.NODE_ENV ?? 'development',
});

export const dataSource = new DataSource({
  type: finalDbConfig.type ?? 'postgres',
  host: finalDbConfig.host,
  port: finalDbConfig.port,
  username: finalDbConfig.username,
  password: finalDbConfig.password,
  database: finalDbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: finalDbConfig.synchronize,
  cache: false,
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [UserSubscriber],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
});
