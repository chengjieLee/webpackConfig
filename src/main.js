// import { modules } from './test';
// import print from './test';
// import "./css/index.css";
// import "./css/index.less";
// import _ from 'lodash';
// import imgSrc from './images/1.png';
// import Data from './data.xml'



// // alert(_.join(["hello","orld"],' w'))
// // console.log(modules.foo(), modules.name)
// var dom = document.getElementById('img');
// var img = document.createElement('img');
// var img2 = new Image()
// img2.src=imgSrc
// img.src=imgSrc
// dom.appendChild(img)
// dom.appendChild(img2)

// new Promise((resolve, reject) => {
//   console.log('promise'),
//   resolve('heHe')
// }).then(res => {
//   console.log(res)
// })

// console.log(Data)
// print()

import Vue from 'vue';
import App from './app'

new Vue({
  el: '#app',
  render: h=>h(App)
})
//.$mount('#app')