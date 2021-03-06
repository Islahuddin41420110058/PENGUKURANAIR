const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // suhu dan kelembaban
    N = (data[0] - 29.5) / 4.617796207  //29.5= avg    4.611213458 = stdev
    B = (data[1] - 9.5) / 5.197158162 
    return [N, B]
}

function denormalized(data){
    A = (data[0] * 0.7222222222) + 0.448682849
    M = (data[1] * 0.5625) + 0.496941867 // 0.497649258 = stdev  0.45 = avg
   
    return [A, M]
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
  
