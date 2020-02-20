FROM node:7

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --only=prod
RUN cp -a /tmp/node_modules /usr/src/app
ADD ./dist/ /usr/src/app

EXPOSE 3000

CMD [ "node", "index.js"]