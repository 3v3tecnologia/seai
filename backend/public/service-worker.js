if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let l={};const t=e=>s(e,o),c={module:{uri:o},exports:l,require:t};n[o]=Promise.all(i.map((e=>c[e]||t(e)))).then((e=>(r(...e),l)))}}define(["./workbox-5b385ed2"],(function(e){"use strict";e.setCacheNameDetails({prefix:"frontend"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"css/chunk-vendors.6cd461e6.css",revision:null},{url:"fonts/primeicons.0112589c.ttf",revision:null},{url:"fonts/primeicons.ba3f916d.woff2",revision:null},{url:"fonts/primeicons.f8b9e8a4.woff",revision:null},{url:"fonts/primeicons.ffecb254.eot",revision:null},{url:"img/primeicons.943ab24c.svg",revision:null},{url:"index.html",revision:"1ecb5b1e84189bddfb6a1c6cfaf27dd5"},{url:"js/792.f9bc5481.js",revision:null},{url:"js/app.d4d9c54d.js",revision:null},{url:"js/chunk-vendors.da8fe44c.js",revision:null},{url:"manifest.json",revision:"4b14c64efaf846819b9a229b4193c8b7"},{url:"robots.txt",revision:"735ab4f94fbcd57074377afca324c813"}],{})}));
//# sourceMappingURL=service-worker.js.map
