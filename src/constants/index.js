import path from 'node:path';

export const sortList = ['asc', 'desc'];


export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;



export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};



export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');


export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');


export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',   // Имя облака, которое вы храните в .env
  API_KEY: 'CLOUD_API_KEY',   // Ваш API ключ
  API_SECRET: 'CLOUD_API_SECRET', // Ваш API секрет
};


export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');