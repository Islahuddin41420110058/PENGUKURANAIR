const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // i & r
    N = (data[0] - 29.5) / 4.615545271
    B = (data[1] - 13) / 7.220133365
    M = (data[2] - 0.5625) / 0.496699634
    A = (data[3] - 41.1) / 56.7427471
    return [N, B, M, A]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]). reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min ))

function ArgMax(res){
    label = "1|1" //MIST MAKER ON AIR TANGKI DIISI
    cls_data = []
    for(i=0; i<res.length; i++){
        cls_data[i] = res[i]
    }
    console.log(cls_data, argMax(cls_data));
    
    if(argMax(cls_data) == 0){
        label = "0|1" //MIST MAKER OFF AIR TANGKI DIISI
    }if(argMax(cls_data) == 2){
        label = "0|0" //MIST MAKER OFF AIR TANGKI OFF 
    }if(argMax(cls_data) == 3){
        label = "1|0" //MIST MAKER ON AIR TANGKI OFF
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
