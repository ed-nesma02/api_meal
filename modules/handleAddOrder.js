import {ORDERS} from './const.js';
import {readRequestBody} from './helpers.js';
import {sendData, sendError} from './send.js';
import fs from 'node:fs/promises';

export const handleAddOrder = async (req, res) => {
  try {
    const body = await readRequestBody(req);
    const newOrder = JSON.parse(body);
    console.log('newOrder: ', newOrder.phone);

    if (
      !newOrder.name ||
      !newOrder.phone ||
      !newOrder.format 
    ) {
      sendError(res, 400, 'Not correct base data');
      return;
    }

    const corderData = await fs.readFile(ORDERS, 'utf8');
    const orders = JSON.parse(corderData);

    orders.push(newOrder);
    await fs.writeFile(ORDERS, JSON.stringify(orders));
    sendData(res, newOrder);
  } catch (error) {
    console.log('error: ', error);
    sendError(res, 500, 'Error is server reading request');
  }
};
