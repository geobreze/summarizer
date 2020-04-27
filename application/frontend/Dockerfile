FROM node:13-buster-slim

COPY build /opt/build
RUN npm install -g serve && npm install -g @beam-australia/react-env@2.1.2

CMD react-env --dest /opt/build && serve -l 80 -s /opt/build
