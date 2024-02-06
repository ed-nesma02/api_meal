import {sendData, sendError} from './send.js';

export const getItems = (req, res, itemId, goods) => {
  const item = goods.find(({id}) => id === itemId);
  if (!item) sendError(res, 400, 'Not found id item');
  sendData(res, item);
};
