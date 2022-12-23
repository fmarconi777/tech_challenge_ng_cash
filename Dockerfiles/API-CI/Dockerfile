FROM node:16

WORKDIR /usr/src/tech_challenge_ng_cash

ADD ./package.json .

LABEL description="Tech Challenge NG Cash API"
LABEL version="1.0"

RUN npm install --omit=dev
