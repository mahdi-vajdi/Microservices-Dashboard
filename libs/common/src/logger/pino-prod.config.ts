import { Params } from 'nestjs-pino';

export const pinoProdConfig = function (): Params {
  return {
    pinoHttp: {
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'warn',
            options: {
              singleLine: true,
              colorize: true,
              levelFirst: false,
              translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l Z',
            },
          },
          {
            target: 'pino/file',
            level: 'error',
            options: {
              destination: `./logs/prod.log`,
              mkdir: true,
            },
          },
        ],
      },
    },
  };
};
