import {sendData, sendError} from './send.js';

export const handleGoodsRequest = async (req, res, params, data) => {
  try {
    if (params.category) {
      const category = params.category.trim().toLowerCase();
      const regExp = new RegExp(`^${category}$`);
      data = data.filter((item) => regExp.test(item.category.toLowerCase()));
    }

    if (params.list) {
      const list = params.list.split(',');
      data = data.filter((item) => list.includes(item.id));
    }

    if (params.list === '') {
      sendData(res, '[]');
      return;
    }

    sendData(res, data);
  } catch (error) {
    console.log('error: ', error);
    sendError(res, 500, 'Error is server reading request');
  }
};
