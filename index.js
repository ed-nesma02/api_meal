import http from 'node:http';
import fs from 'node:fs/promises';
import {sendError} from './modules/send.js';
import {handleDataRequest} from './modules/handleDataRequest.js';
import {handleAddOrder} from './modules/handleAddOrder.js';
import {CATEGORY, DATABASE, ORDERS, PORT, URI_PREFIX} from './modules/const.js';
import {checkFileExist, createFileIfNotExist} from './modules/checkFile.js';
import {readFile} from 'node:fs';
import {handleGoodsRequest} from './modules/handleGoodsRequest.js';
import {getItems} from './modules/getItemsId.js';

const startServer = async () => {
  if (!(await checkFileExist(DATABASE))) {
    return;
  }

  await createFileIfNotExist(ORDERS);
  

  const productsData = await fs.readFile(DATABASE, 'utf-8');
  const categoryData = await fs.readFile(CATEGORY, 'utf-8');
  const products = JSON.parse(productsData);
  const category = JSON.parse(categoryData);

  http
    .createServer(async (req, res) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET,HEAD,OPTIONS,POST,PUT'
        );
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Accept, Authorization'
        );

        const [uri, query] = req.url.substr(URI_PREFIX.length).split('?');
        const queryParams = {};

        if (query) {
          for (const piece of query.split('&')) {
            const [key, value] = piece.split('=');
            queryParams[key] = value ? decodeURIComponent(value) : '';
          }
        }

        if (req.url.substring(1, 4) === 'img') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'image/jpeg');
          readFile(`.${req.url}`, (err, image) => {
            res.end(image);
          });
          return;
        }

        if (!req.url) {
          sendError(res, 404, 'Not found.');
          return;
        }

        if (req.method === 'POST' && req.url.endsWith('order')) {
          handleAddOrder(req, res);
          return;
        }

        if (uri === '' || uri === '/') {
          handleGoodsRequest(req, res, queryParams, products);
          return;
        } else if (req.url.endsWith('category')) {
          console.log(req.url);
          if (req.method === 'GET') {
            handleDataRequest(req, res, category);
            return;
          }
        } else {
          const itemId = uri.substr(1);
          if (req.method === 'GET') getItems(req, res, itemId, products);
          return;
        }

        sendError(res, 404, `Not found`);
      } catch (error) {
        sendError(res, 500, `Error server: ${error}`);
      }
    })
    .listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
};

startServer();
