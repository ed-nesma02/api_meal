import {sendData} from './send.js';

export const handleDataRequest = async (req, res, data) => {
  sendData(res, data);
};
