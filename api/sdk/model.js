const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // suhu dan kelembaban
    N = (data[0] - 29.5) / 4.618269512  //29.5= avg    4.611213458 = stdev
    B = (data[1] - 9) / 4.90800987
    return [N, B]
}

function denormalized(data){
    M = (data[0] * 0.5625) + 0.496992802 // 0.497649258 = stdev  0.45 = avg
    A = (data[1] * 1.941176471) + 0.640164945
    return [M, A]
}


async function predict(data){
    let in_dim = 2;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/Islahuddin41420110058/PENGUKURANAIR/main/public/ex_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    predict: predict 
}
  
