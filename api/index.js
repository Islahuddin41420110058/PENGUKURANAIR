var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5091733513:AAHCEuG_3zHV53IbEK3CHrVTIDur4piANL8'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// bots
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        Selamat datang di TA islahuddin
        click /predict`
    );   
    state = 0;
});

//input N dan B
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `input nilai suhu|jarak contohnya 25|10`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1])
            ]
        ).then((dres1)=>{
            console.log(dres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(dres1[0]), parseFloat(dres1[1])]).then((dres2)=>{
                bot.sendMessage(
                        msg.chat.id,
                        `nilai suhu yang diprediksi adalah ${dres1[0]}`
                );
                bot.sendMessage(
                        msg.chat.id,
                        `nilai keadaanair yang diprediksi adalah ${dres1[1]}`
                ); 
                bot.sendMessage(
                        msg.chat.id,
                        `Klasifikasi ${dres2}`
                );
                state = 0;
            })
        })
    }else{
        bot.sendMessage(
        msg.chat.id,
              `Please Click /start `
        );
        state = 0
    }
})
// routers
r.get('/predict/:N/:B', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.N), // string to float
            parseFloat(req.params.B)
        ]
    ).then((dres)=>{
        res.json(dres);
    })
});

//routers
r.get('/classify/:N/:B', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.N), // string to float
            parseFloat(req.params.B)
        ]
    ).then((dres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.N), // string to float
                parseFloat(req.params.B),
                parseFloat(dres[0]),
                parseFloat(dres[1])
            ]
        ).then((dres_)=>{
            let status = "MIST MAKER OFF AIR SEDANG DIISI";
            
            if(dres_ == "1|1"){
                status = "MIST MAKER ON AIR SEDANG DIISI"
            }if(dres_ == "0|0"){
                status = "MIST MAKER OFF AIR OFF "
            }if(dres_ == "1|0"){
                status = "MIST MAKER ON AIR OFF"
            
            }
            
//             dres_.split("|");
            const mistmaker = parseFloat(req.params.N);
            const pengisianair = parseFloat(req.params.B)
           
            bot.sendMessage(
                    2128268907, //msg.id
                    `mistmaker:: ${mistmaker} pengisianair ${pengisianair} KONDISI:: ${status}`
                     
                     
            ); // to telegram
            
            res.json({dres, dres_})
        })
    })
});

module.exports = r;
