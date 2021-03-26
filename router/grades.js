import express from 'express';
import { promises as fs } from 'fs';
const router = express.Router();
const { readFile, writeFile } = fs;

router.post('/', async (req, res, next) => {
  try {
    let grade = req.body;
    if (
      !grade.student ||
      !grade.subject ||
      !grade.type ||
      grade.value == null
    ) {
      throw new Error('Dados inválidos!');
    }
    const data = JSON.parse(await readFile('grades.json'));
    grade = {
      id: data.nextId++,
      student: grade.student,
      subject: grade.subject,
      type: grade.type,
      value: grade.value,
      timestamp: new Date(),
    };
    data.grades.push(grade);
    await writeFile('grades.json', JSON.stringify(data));
    logger.info(`POST /grades - ${JSON.stringify(grade)}`);
    res.send(grade);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    let grade = req.body;
    if (
      grade.id == null ||
      !grade.student ||
      !grade.subject ||
      !grade.type ||
      grade.value == null
    ) {
      throw new Error('Dados inválidos!');
    }
    const data = JSON.parse(await readFile('grades.json'));
    const i = data.grades.findIndex((aux) => aux.id == grade.id);
    if (i == -1) {
      throw new Error('Registro não encontrado!');
    }
    data.grades[i].student = grade.student;
    data.grades[i].subject = grade.subject;
    data.grades[i].type = grade.type;
    data.grades[i].value = grade.value;
    await writeFile('grades.json', JSON.stringify(data));
    logger.info(`PUT /grades - ${JSON.stringify(grade)}`);
    res.send(grade);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile('grades.json'));
    data.grades = data.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id)
    );
    await writeFile('grades.json', JSON.stringify(data));
    logger.info(`DELETE /grades/:id - ${req.params.id}`);
    res.send('Deleted!');
  } catch (err) {
    next(err);
  }
});

router.get('/grade/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile('grades.json'));
    const grade = data.grades.find((aux) => aux.id == parseInt(req.params.id));
    logger.info(`GET /grades/:id - ${req.params.id}`);
    res.send(grade);
  } catch (err) {
    next(err);
  }
});

router.get('/nota', async (req, res, next) => {
  try {
    let aux = req.body;
    if (!aux.student || !aux.subject) {
      throw new Error('Registro não encontrado!');
    }
    let nota = 0;
    const data = JSON.parse(await readFile('grades.json'));
    data.grades.forEach((grade) => {
      if (grade.student == aux.student && grade.subject == aux.subject) {
        nota += grade.value;
      }
    });
    aux = {
      student: aux.student,
      subject: aux.subject,
      TotalGrade: nota,
    };
    logger.info(`GET /grades/nota - ${JSON.stringify(aux)}`);
    res.send(aux);
  } catch (err) {
    next(err);
  }
});

router.get('/media', async (req, res, next) => {
  try {
    let aux = req.body;
    if (!aux.type || !aux.subject) {
      throw new Error('Registro não encontrado!');
    }
    let sum = 0;
    let i = 0;
    const data = JSON.parse(await readFile('grades.json'));
    data.grades.forEach((grade) => {
      if (grade.type == aux.type && grade.subject == aux.subject) {
        sum += grade.value;
        i++;
      }
    });
    aux = {
      subject: aux.subject,
      type: aux.type,
      Media: sum / i,
    };
    logger.info(`GET /grades/media - ${JSON.stringify(aux)}`);
    res.send(aux);
  } catch (err) {
    next(err);
  }
});

router.get('/melhores', async (req, res, next) => {
  try {
    let aux = req.body;
    if (!aux.type || !aux.subject) {
      throw new Error('Dados inválidos!');
    }
    const data = JSON.parse(await readFile('grades.json'));
    let best = data.grades.filter(
      (grade) => grade.type === aux.type && grade.subject === aux.subject
    );
    best.sort((a, b) => {
      return a.value > b.value ? -1 : a.value < b.value ? 1 : 0;
    });
    best = [best[0], best[1], best[2]];
    res.send(best);
    logger.info(`GET /grades/melhores - ${JSON.stringify(best)}`);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, _next) => {
  logger.error(`${req.method} ${req.baseUrl}: ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
