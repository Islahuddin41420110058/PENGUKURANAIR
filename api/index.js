var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5057431556:AAGnOFgp9MlogJhT3sjbMafwdIAdpPX2L8M'
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
        `input nilai N|B contohnya 30|14`
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
        ).then((hasil1)=>{
            console.log(hasil1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(hasil1[0]), parseFloat(hasil1[1])]).then((hasil2)=>{
                bot.sendMessage(
                        msg.chat.id,
                        `nilai ketinggianair yang diprediksi adalah ${hasil1[0]}`
                );
                bot.sendMessage(
                        msg.chat.id,
                        `nilai mistmaker yang diprediksi adalah ${hasil1[1]}`
                ); 
                bot.sendMessage(
                        msg.chat.id,
                        `Klasifikasi ${hasil2}`
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
    ).then((hasil)=>{
        res.json(hasil);
    })
});

//routers
r.get('/classify/:N/:B', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.N), // string to float
            parseFloat(req.params.B)
        ]
    ).then((hasil)=>{
        cls_model.classify(
            [
                parseFloat(req.params.N), // string to float
                parseFloat(req.params.B),
                parseFloat(hasil[0]),
                parseFloat(hasil[1])
            ]
        ).then((hasil_)=>{
            let status = "KRAN OFF MISTMAKER OFF";
            
            if(hasil_ == "0|1"){
                status = "KRAN OFF MISTMAKER ON"
            }if(hasil_ == "1|0"){
                status = "KRAN ON MISTMAKER OFF"
            }if(hasil_ == "1|1"){
                status = "KRAN ON MISTMAKER ON"
            }
            
//             jres_.split("|");
            const suhu = parseFloat(req.params.N);
            const ketinggianair = parseFloat(req.params.B)
           
            bot.sendMessage(
                    2128268907, //msg.id
                    `SUHU:: ${suhu} AIR ${ketinggianair} KONDISI:: ${status}`
                     
                     
            ); // to telegram
            
            res.json({hasil, hasil_})
        })
    })
});

module.exports = r;
