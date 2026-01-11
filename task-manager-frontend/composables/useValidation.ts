import { object, string, date } from 'yup'

// Схемы валидации с использованием Yup
export const useTaskValidation = () => {
  const taskSchema = object({
    title: string()
      .required('Название задачи обязательно')
      .min(3, 'Название должно содержать минимум 3 символа')
      .max(100, 'Название не должно превышать 100 символов'),
    description: string()
      .max(500, 'Описание не должно превышать 500 символов')
      .optional(),
    status: string()
      .oneOf(['todo', 'in_progress', 'done'], 'Неверный статус')
      .optional(),
    priority: string()
      .oneOf(['low', 'medium', 'high'], 'Неверный приоритет')
      .required('Приоритет обязателен'),
    dueDate: date()
      .min(new Date(), 'Дедлайн не может быть в прошлом')
      .optional()
      .nullable(),
  })

  return { taskSchema }
}

export const useAuthValidation = () => {
  const loginSchema = object({
    email: string()
      .required('Email обязателен')
      .email('Неверный формат email'),
    password: string()
      .required('Пароль обязателен')
      .min(8, 'Пароль должен содержать минимум 8 символов'),
  })

  const registerSchema = object({
    email: string()
      .required('Email обязателен')
      .email('Неверный формат email'),
    password: string()
      .required('Пароль обязателен')
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Пароль должен содержать заглавные и строчные буквы, а также цифры'
      ),
    firstName: string()
      .required('Имя обязательно')
      .min(2, 'Имя должно содержать минимум 2 символа')
      .max(50, 'Имя не должно превышать 50 символов'),
    lastName: string()
      .required('Фамилия обязательна')
      .min(2, 'Фамилия должна содержать минимум 2 символа')
      .max(50, 'Фамилия не должна превышать 50 символов'),
  })

  const profileSchema = object({
    firstName: string()
      .required('Имя обязательно')
      .min(2, 'Имя должно содержать минимум 2 символа')
      .max(50, 'Имя не должно превышать 50 символов'),
    lastName: string()
      .required('Фамилия обязательна')
      .min(2, 'Фамилия должна содержать минимум 2 символа')
      .max(50, 'Фамилия не должна превышать 50 символов'),
  })

  return { loginSchema, registerSchema, profileSchema }
}
