import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { join } from 'path'; // Додано для правильної роботи з шляхами файлів

const configService = new ConfigService({
  envFilePath: '../.env.dev',
});

const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'admin',
  password: 'root',
  database: 'postgres',
  entities: [
    join(__dirname, '**', 'entities', '*.entity.js'), // Вказати правильний шлях до скомпільованих entity файлів
  ],
  migrations: ['src/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export { AppDataSource };
