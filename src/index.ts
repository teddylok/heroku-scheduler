import * as _ from 'lodash';
import * as Moment from 'moment';
import * as Emoji from 'node-emoji';
import * as Express from 'express';
import * as Schedule from 'node-schedule';
import * as Request from 'request-promise';

const app = Express();

app.get('/', (req, res) => {
  res.send('Heroku scheduler is up.');
});

const host = process.env.HOST;
const port = process.env.PORT || 80;

const server = app.listen(port, () => {
  console.log(`${Emoji.get('robot_face')}  Hi! I am up ${host}:${port}`);
});

// schedule to ping Heroku every 15min
const targetHost = process.env.TARGET_HOST;
const rule = new Schedule.RecurrenceRule();
rule.hour = [21, 22, 23, 0, 1, 2, 3, 4, 5];
rule.minute = [0, 15, 30, 45];

const job = Schedule.scheduleJob(rule, () => {
  Request(`http://${host}`)
    .then(() => console.log(`Ping ${host} at ${Moment()}`))
    .catch(err => console.log(err));
});

// schedule to wakeUp the scheduler
const job2 = Schedule.scheduleJob('* * 5 * * *', () => {
  Request(`http://${targetHost}`)
    .then(() => console.log(`Ping ${targetHost} at ${Moment()}`))
    .catch(err => console.log(err));
});