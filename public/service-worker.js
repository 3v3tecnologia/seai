if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let l={};const c=e=>i(e,o),t={module:{uri:o},exports:l,require:c};s[o]=Promise.all(n.map((e=>t[e]||c(e)))).then((e=>(r(...e),l)))}}define(["./workbox-5b385ed2"],(function(e){"use strict";e.setCacheNameDetails({prefix:"frontend"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"css/app.12318c7d.css",revision:null},{url:"css/chunk-vendors.b29fc290.css",revision:null},{url:"fonts/primeicons.0112589c.ttf",revision:null},{url:"fonts/primeicons.ba3f916d.woff2",revision:null},{url:"fonts/primeicons.f8b9e8a4.woff",revision:null},{url:"fonts/primeicons.ffecb254.eot",revision:null},{url:"img/primeicons.943ab24c.svg",revision:null},{url:"index.html",revision:"c2110772323ae7ba16f72d2a5aebedfd"},{url:"js/792.f9bc5481.js",revision:null},{url:"js/app.aa4c4e58.js",revision:null},{url:"manifest.json",revision:"4b14c64efaf846819b9a229b4193c8b7"},{url:"robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
