FROM node:18 as builder

WORKDIR /build

COPY package*.json .
RUN npm install

COPY src/ src/
COPY tsconfig.json tsconfig.json

RUN npm run build


# runner

FROM node:18 as runner

WORKDIR /app

# Install Doppler CLI
RUN curl -Ls https://cli.doppler.com/install.sh | sh

COPY --from=builder build/package*.json .
COPY --from=builder build/node_modules node_modules
COPY --from=builder build/dist dist/

CMD [ "npm", "start" ]