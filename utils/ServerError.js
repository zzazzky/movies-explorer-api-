class ServerError extends Error {
  constructor() {
    super('Ой! Произошла ошибка на сервере, попробуйте еще раз');
    this.name = 'ServerError';
    this.statusCode = 500;
  }
}

module.exports = ServerError;
