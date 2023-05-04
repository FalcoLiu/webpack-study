// 完整加载
// import 'core-js';
// 按需加载
// import 'core-js/es/promise';


import count from './js/count';
import sum from './js/sum.js';
// 想webpack打包资源,必须引入资源
import './css/index.css';
import './less/index.less';
import './sass/index.sass';
import './sass/index.scss';
import './stylus/index.styl';


let result = count(2,1);
console.log(result);
console.log(sum(1,2,3,4));

document.getElementById('btn').onclick = function () {
    import( /* webpackChunkName:"math" */'./js/math').then(({mul}) => {
        // /* webpackChunkName:"math" */ webpack 魔法命名
        console.log(mul(3,3));
    })
}

if(module.hot) {
    // 判断是否支持热模块替换功能
    module.hot.accept('./js/count.js')
}

new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    },1000)
})

const arr = [1,2,3]
console.log(arr.includes(1))

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }