import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

const taskTitles = [
  'Изучить NestJS',
  'Настроить TypeORM',
  'Создать API для задач',
  'Написать тесты',
  'Оптимизировать запросы к БД',
  'Добавить аутентификацию JWT',
  'Настроить Swagger документацию',
  'Добавить валидацию данных',
  'Реализовать пагинацию',
  'Создать фронтенд на Nuxt',
  'Добавить фильтры задач',
  'Реализовать поиск',
  'Добавить сортировку',
  'Создать статистику задач',
  'Настроить CORS',
  'Добавить обработку ошибок',
  'Оптимизировать производительность',
  'Добавить логирование',
  'Настроить окружение',
  'Добавить CI/CD',
];

const taskDescriptions = [
  'Изучить основы NestJS и его архитектуру',
  'Настроить подключение к PostgreSQL через TypeORM',
  'Создать RESTful API для управления задачами',
  'Написать unit и e2e тесты для приложения',
  'Оптимизировать запросы к базе данных',
  'Реализовать JWT аутентификацию для пользователей',
  'Настроить Swagger для автоматической документации API',
  'Добавить валидацию входящих данных с помощью class-validator',
  'Реализовать пагинацию для списка задач',
  'Создать фронтенд приложение на Nuxt 3',
  'Добавить фильтрацию задач по статусу и приоритету',
  'Реализовать полнотекстовый поиск по задачам',
  'Добавить сортировку задач по различным полям',
  'Создать страницу со статистикой задач',
  'Настроить CORS для фронтенда',
  'Добавить централизованную обработку ошибок',
  'Оптимизировать производительность приложения',
  'Добавить логирование важных событий',
  'Настроить переменные окружения для разных сред',
  'Настроить автоматический деплой через CI/CD',
];

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Начало заполнения базы данных...');

  const userRepository = dataSource.getRepository(User);
  const taskRepository = dataSource.getRepository(Task);

  // Очистка существующих задач
  console.log('🗑️  Очистка существующих задач...');
  await taskRepository.createQueryBuilder().delete().from(Task).execute();
  console.log('✅ Старые задачи удалены');

  // Создание пользователей
  console.log('👤 Создание/обновление пользователей...');

  const users: User[] = [];

  // Администратор
  let admin = await userRepository.findOne({ where: { email: 'admin@admin.com' } });
  if (!admin) {
    const adminPassword = await bcrypt.hash('Admin123', 10);
    admin = userRepository.create({
      email: 'admin@admin.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    });
    admin = await userRepository.save(admin);
    console.log(`✅ Создан пользователь: ${admin.email}`);
  } else {
    console.log(`ℹ️  Пользователь уже существует: ${admin.email}`);
  }
  users.push(admin);

  // Тестовый пользователь
  let testUser = await userRepository.findOne({ where: { email: 'test@test.com' } });
  if (!testUser) {
    const testPassword = await bcrypt.hash('Test123', 10);
    testUser = userRepository.create({
      email: 'test@test.com',
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
    });
    testUser = await userRepository.save(testUser);
    console.log(`✅ Создан пользователь: ${testUser.email}`);
  } else {
    console.log(`ℹ️  Пользователь уже существует: ${testUser.email}`);
  }
  users.push(testUser);

  // Демо пользователь
  let demoUser = await userRepository.findOne({ where: { email: 'demo@demo.com' } });
  if (!demoUser) {
    const demoPassword = await bcrypt.hash('Demo123', 10);
    demoUser = userRepository.create({
      email: 'demo@demo.com',
      password: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      isActive: true,
    });
    demoUser = await userRepository.save(demoUser);
    console.log(`✅ Создан пользователь: ${demoUser.email}`);
  } else {
    console.log(`ℹ️  Пользователь уже существует: ${demoUser.email}`);
  }
  users.push(demoUser);

  // Создание задач для каждого пользователя
  console.log('📝 Создание задач...');

  const statuses: Array<'todo' | 'in_progress' | 'done'> = ['todo', 'in_progress', 'done'];
  const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

  for (const user of users) {
    // Создаем разное количество задач для каждого пользователя
    const taskCount = user.email === 'admin@admin.com' ? 15 : user.email === 'test@test.com' ? 10 : 8;

    for (let i = 0; i < taskCount; i++) {
      const taskIndex = Math.floor(Math.random() * taskTitles.length);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];

      // Генерируем дату дедлайна (от -5 дней до +30 дней)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (Math.floor(Math.random() * 35) - 5));
      dueDate.setHours(Math.floor(Math.random() * 24), 0, 0, 0);

      const taskData: Partial<Task> = {
        title: taskTitles[taskIndex],
        description: taskDescriptions[taskIndex],
        status,
        priority,
        dueDate: Math.random() > 0.3 ? dueDate : undefined, // 70% задач имеют дедлайн
        user_id: user.id,
      };

      const task = taskRepository.create(taskData);
      await taskRepository.save(task);
    }

    console.log(`✅ Создано ${taskCount} задач для пользователя: ${user.email}`);
  }

  const totalTasks = await taskRepository.count();
  const totalUsers = await userRepository.count();

  console.log('');
  console.log('✨ Заполнение базы данных завершено!');
  console.log(`📊 Статистика:`);
  console.log(`   - Пользователей: ${totalUsers}`);
  console.log(`   - Задач: ${totalTasks}`);
  console.log('');
  console.log('🔑 Учетные данные:');
  console.log('   Администратор:');
  console.log('     Email: admin@admin.com');
  console.log('     Password: Admin123');
  console.log('   Тестовый пользователь:');
  console.log('     Email: test@test.com');
  console.log('     Password: Test123');
  console.log('   Демо пользователь:');
  console.log('     Email: demo@demo.com');
  console.log('     Password: Demo123');
}
