const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules.js/replaceTemplate');

////////////////////////////////////////////////////////////////////////////////////////////////////
//files

// blocking code
// const textIn = fs.readFileSync('./input.txt', 'utf-8');

// const textOut = `this is what we know about the avocado: ${textIn}`;
// fs.writeFileSync('./output.txt',textOut);
// console.log("file written");

// non blocking code
// fs.readFile('./txt/start.txt','utf-8',(err, data1) =>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err, data2) =>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3) =>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2} \n ${data3}`,'utf-8',(err, data) =>{
//                 console.log("your file has been written :)");
//             });
//         });
//     });
// });

// console.log('reading file...');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SERVER


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower:true }));
console.log(slugs);

const server = http.createServer((req, res) =>{
    const {query, pathname} = url.parse(req.url, true);

    //OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);

    //PRODUCT PAGE
    }else if(pathname ==='/product'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
    
    //API
    }else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

    //NOT FOUND
    }else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('Page not found');
    }
});

server.listen(8000,'127.0.0.1',() =>{
    console.log('Listening to requests on port 8000');
});