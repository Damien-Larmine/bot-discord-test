const Discord = require('discord.js')
const config = require('./config.json')

const bot = new Discord.Client()
var log4js = require('log4js');

log4js.configure({
  appenders: { infoYtb : { type: 'file', filename: 'logs/ytb.log'} },
  categories: { default: { appenders: ['infoYtb'], level: 'info'}}
});

var logger = log4js.getLogger('log');
var connec;

bot.on('ready', function () {
  console.log('Je suis connecté !')
})

bot.login(config.token)

bot.on('message', message => {
  if(message.content === 'ping') {
    message.reply('pong')
  }

  if(message.content.startsWith('!roll')) {
    let args = message.content.split(' ')
    rollDice(args[1], message);
  }

})

function rollDice(diceToRoll, messageToReply) {
  const roll = diceToRoll.split('d');
  const nbDice = parseInt(roll[0], 10);
  let dice, diceWithBonus, bonus;
  let response = '';
  let sum = 0;

  if(roll[1].indexOf('+') > -1) {
    diceWithBonus = roll[1].split('+');
    dice = diceWithBonus[0];
    bonus = diceWithBonus[1];
  } else {
    dice = parseInt(roll[1], 10);
  }

  for(let i = 1; i <= nbDice; i += 1) {
    let diceRoll = getRandomInt(dice);
    if( i === 1) {
      response = 'Le 1er lancer a fait ' + diceRoll;
    } else {
      response += '\nLe ' + i + 'ème lancer a fait ' + diceRoll
    }
    sum += diceRoll;
  }

  if (nbDice === 1) {
    response += '\nLancer : ' + sum
  } else {
    response += '\nTotal des lancers : ' + sum
  }

  if(bonus) {
    const total = parseInt(sum,10) + parseInt(bonus,10);
    response += '\nLe total vaut ' + total
  }

  messageToReply.reply(response)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}
