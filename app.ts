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
  from: string,
  to: string
}

app.get<EventQueryType, any, any, EventQueryType>('/events', async (req, res) => {
  try {
    const { from, to } = req.query;
    const events = await ScheduleEvent.getEvents(new Date(from), new Date(to));
    res.send(events.map(ev => ev.data));
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
