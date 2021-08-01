FROM node:latest

# Install system dependencies
RUN set -x \
    && apt-get update \
    && apt-get -yq install git \
    && apt-get -yq clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && git --version && npm -v && node -v

# Create and move to package dir
RUN mkdir -p /opt/morale_bot
WORKDIR /opt/morale_bot

# Copy package info and install node dependencies
COPY *.json ./
RUN npm install

# Copy necessary code from repo
COPY assets assets
COPY commands commands
COPY database database
COPY events events
COPY *.js LICENSE ./

ENTRYPOINT [ "node", "index.js" ]