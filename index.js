import express from 'express';
import { promises as fs } from 'fs';
import winston from 'winston';
import router from './router/grades.js';

const { writeFile, readFile } = fs;

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'grades-control-api.log' }),
  ],
  format: combine(
    label({ label: 'grades-control-api' }),
    timestamp(),
    myFormat
  ),
});

const app = express();
app.use(express.json());
app.use('/grades', router);
app.listen(3000, async () => {
  try {
    await readFile('grades.json');
    logger.info('API started!');
  } catch (err) {
    logger.info(err);
  }
});
