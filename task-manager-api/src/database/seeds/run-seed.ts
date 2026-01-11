import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedDatabase } from './seed';
import { User } from '../../auth/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'task_manager',
  entities: [User, Task],
  synchronize: false,
  logging: false,
});

async function runSeed() {
  try {
    console.log('🔌 Подключение к базе данных...');
    await dataSource.initialize();
    console.log('✅ Подключение установлено');

    await seedDatabase(dataSource);

    await dataSource.destroy();
    console.log('✅ Отключение от базы данных');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeed();
