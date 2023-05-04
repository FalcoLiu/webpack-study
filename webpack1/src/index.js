// import dianzan from './dianzan.js';
// import yijiansanlian from './yijiansanlian.js';


// console.log('下次一定');


// import axios from 'axios';
// axios.get('/api/yixiantong/getHomeDatas')
//     .then(({data}) => {
//         console.log('data',data);
//     })

// import './index1.scss';


// const div = document.createElement('div');
// div.setAttribute('id','test');
// const app = document.getElementById('app');
// app.appendChild(div);

const insertImgElement = (imgFile) => {
    const img = new Image();
    img.src = imgFile;
    document.body.appendChild(img);
}

import vueImg from './img/vue.jpeg';
insertImgElement(vueImg);

import reactImg from './img/react.jpeg';
insertImgElement(reactImg);