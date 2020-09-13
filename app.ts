const createError = require('http-errors');
import express = require('express');
import ScheduleEvent from './models/ScheduleEvent';
const path = require('path');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

type EventQueryType = {
  timeMin: string,
  timeMax: string
}

app.get<EventQueryType, any, any, EventQueryType>('/events', async (req, res) => {
  try {
    const { timeMin, timeMax } = req.query;
    const events = await ScheduleEvent.getEvents(new Date(timeMin), new Date(timeMax));
    const schedule = events.filter(ev => ev.kind === 'schedule').map(ev => ev.data);
    const exams = events.filter(ev => ev.kind === 'exams').map(ev => ev.data);
    res.send({ schedule, exams });
  } catch (err) {
    res.status(400);
    res.send({error: 'Bad request'})
  }
});

app.get('/sync', async (req, res) => {
  try {
    const synced = await ScheduleEvent.syncWithGoogle();
    res.send(synced);
  } catch (err) {
    res.status(500);
    res.send({ error: err.message || "Internal server error" })
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
