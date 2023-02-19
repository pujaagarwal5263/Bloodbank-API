class Commons{
    Response(res, statusCode,status, message, data) {
         res.status(statusCode).json({ status, message, data });
      }
}

export default new Commons();
