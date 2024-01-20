import { Params } from 'nestjs-pino';

export const pinoDevConfig = function (): Params {
  return {
    pinoHttp: {
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'trace',
            options: {
              singleLine: true,
              colorize: true,
              levelFirst: false,
              translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l Z',
            },
          },
          {
            target: 'pino/file',
            level: 'trace',
            options: {
              destination: `./logs/dev.log`,
              mkdir: true,
            },
          },
        ],
      },
    },
  };
};
