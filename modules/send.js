export const sendData = (res, data) => {
  res.writeHead(200, {
    'content-type': 'text/json; charset=utf-8',
  });
  res.end(JSON.stringify(data));
};

export const sendError = (res, statusCode, errMessage) => {
  res.writeHead(statusCode, {
    'content-type': 'text/json; charset=utf-8',
  });
  res.end(errMessage);
};