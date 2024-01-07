# Build image
FROM node:18.14.0 AS BUILD_IMAGE

# Install dependencies
WORKDIR /server
COPY package.json yarn.lock tsconfig*.json /server/

RUN yarn install --production=true --pure-lockfile

COPY . .

# Build the application
RUN yarn run build service-gateway

# Remove development dependencies
RUN curl -sf https://gobinaries.com/tj/node-prune | sh \
  && node-prune

# Production images
FROM node:18.14.0-alpine
WORKDIR /server

COPY --from=BUILD_IMAGE /server/dist ./dist
COPY --from=BUILD_IMAGE /server/node_modules ./node_modules

# Command
CMD ["node", "dist/apps/service-gateway/main.js"]
