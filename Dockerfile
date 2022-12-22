FROM node:19-alpine as base

# Prepare Node

FROM base AS install

RUN npm install pm2 -g

USER node

WORKDIR  /home/node/shift-planner

COPY --chown=node:node package*.json ./

RUN npm ci --progress=false

COPY --chown=node:node . .

# Prepare overlay for local development
FROM install AS development

ARG DB_HOST
ENV DB_HOST=$DB_HOST

COPY --chown=node:node --from=install /home/node/shift-planner ./

EXPOSE 3000
EXPOSE 9229

CMD ["nest", "start", "--watch"]

# Intermediate build overlay
FROM install AS build

RUN npm run build && npm prune --production

# Final overlay for production
FROM base AS production

ARG ENVIRONMENT
ARG DB_HOST
ENV DB_HOST=$DB_HOST

RUN npm install pm2 -g

WORKDIR /home/node/shift-planner

RUN chown node:node /home/node/shift-planner

USER node

COPY --chown=node:node --from=build /home/node/shift-planner/dist ./dist
COPY --chown=node:node --from=build /home/node/shift-planner/ecosystem.config.js ./
COPY --chown=node:node --from=build /home/node/shift-planner/node_modules ./node_modules
COPY --chown=node:node --from=build /home/node/shift-planner/package*.json ./

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "$ENVIRONMENT"]
