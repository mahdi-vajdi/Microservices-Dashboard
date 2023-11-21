FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json

RUN npm install --loglevel verbose

COPY apps/users apps/users
COPY libs libs

RUN cd apps/users && npm install --loglevel verbose

RUN npm run build --loglevel verbose

FROM node:alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --omit=dev --loglevel verbose

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/users/main"]