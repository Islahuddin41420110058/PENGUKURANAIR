const tf = require('@tensorflow/tfjs-node');

function normalized(data){ 
    N = (data[0] - 29.5) / 4.617796207
    B = (data[1] - 9.5) / 5.197158162
    M = (data[2] - 0.5625) / 0.496941867
    A = (data[3] - 4.333333333) / 4.197228221
    return [N, B, M, A]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]). reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min ))

function ArgMax(res){
    label = "0|1" //MIST MAKER OFF AIR TANGKI ON
    cls_data = []
    for(i=0; i<res.length; i++){
        cls_data[i] = res[i]
    }
    console.log(cls_data, argMax(cls_data));
    
    if(argMax(cls_data) == 1){
        label = "1|1" //MIST MAKER ON AIR TANGKI ON
    }if(argMax(cls_data) == 4){
        label = "0|2" //MIST MAKER OFF AIR TANGKI PROSES 
    }if(argMax(cls_data) == 5){
        label = "1|2" //MIST MAKER ON AIR TANGKI PROSES
    }if(argMax(cls_data) == 2){
        label = "0|3" //MIST MAKER OFF AIR TANGKI OFF
    }if(argMax(cls_data) == 3){
        label = "1|3" //MIST MAKER ON AIR TANGKI OFF
    }
    return label
}
async function classify(data){
    let in_dim = 4;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/Islahuddin41420110058/PENGUKURANAIR/main/public/cls_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return ArgMax( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    classify: classify 
}
