const Discord = require('discord.js')
const YoutubeStream = require('youtube-audio-stream')
const bot = new Discord.Client()
var log4js = require('log4js');

log4js.configure({
  appenders: { infoYtb : { type: 'file', filename: 'logs/ytb.log'} },
  categories: { default: { appenders: ['infoYtb'], level: 'info'}}
});

var logger = log4js.getLogger('log');

bot.on('ready', function () {
  console.log('Je suis connecté !')
})

bot.login('Mzg2NTAyNDc0NjIzNzQ2MDQ4.DQQ2Ig.nl6uMlrzuvuuxJm5ohKIZcSeryA')

bot.on('message', message => {
  if(message.content === 'ping') {
    message.reply('pong')
  }

  if(message.content.startsWith('!play')) {

        // On récupère le premier channel audio du serveur
        let voiceChannel = message.guild.channels
          .filter(function (channel) {
            return channel.type === 'voice' && channel.members
              .find(function (member) {
                return member.id === message.author.id
              })
            }).first()

        if(!voiceChannel) {
          voiceChannel =  message.guild.channels
            .filter(function (channel) {
              return channel.type === 'voice'
            }).first()
        }

        //On récupère les arguments de la commande
        //Il faudrait utiliser une regexp pour valider le lien youtube
        let args = message.content.split(' ')

        //On rejoint le channel audio
        voiceChannel
          .join()
          .then(function (connection){
            //On démarre un stream à partir de la video youtube
            let stream = YoutubeStream(args[1])
            stream.on('error', function () {
              message.reply('Je n\'ai pas réussi à lire cette vidéo :(')
              connection.disconnect()
            })
            //On envoie le stream au channel audio
            //Il faudrait ici éviter les superpositions (envoi de plusieurs vidéo en même temps)
            connection
              .playStream(stream)
              .on('end', function() {
                connection.disconnect()
              })
          })
  }
})
