FROM node:12.19.1-alpine3.12 AS builder

ARG CMD
ARG APP_BASE_URL
ARG APP_WEBSOCKET
ARG APP_COMPANY_ID
ARG APP_PLATFORM
ARG APP_CUSTOM_SERVER
ARG APP_HOME_PAGE
ARG APP_TRACK
ARG APP_YOUSHU_TOKEN
ARG APP_ID
ARG APP_MAP_KEY
ARG APP_MAP_NAME
ARG APP_VUE_SAAS

ENV APP_BASE_URL ${APP_BASE_URL}
ENV APP_WEBSOCKET ${APP_WEBSOCKET}
ENV APP_COMPANY_ID ${APP_COMPANY_ID}
ENV APP_PLATFORM ${APP_PLATFORM}
ENV APP_CUSTOM_SERVER ${APP_CUSTOM_SERVER}
ENV APP_HOME_PAGE ${APP_HOME_PAGE}
ENV APP_TRACK ${APP_TRACK}
ENV APP_YOUSHU_TOKEN ${APP_YOUSHU_TOKEN}
ENV APP_ID ${APP_ID}
ENV APP_MAP_KEY ${APP_MAP_KEY}
ENV APP_MAP_NAME ${APP_MAP_NAME}
ENV APP_VUE_SAAS ${APP_VUE_SAAS}

WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm config set registry https://registry.npm.taobao.org && npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/ && npm config set @shopex:registry http://registry.npm.ishopex.cn && npm ci

COPY . .
RUN ls -la
RUN ${CMD}
RUN ls -l /app/dist/h5

FROM steebchen/nginx-spa:stable
WORKDIR /app
COPY --from=builder /app/dist/h5 .
EXPOSE 80
CMD ["nginx"]
