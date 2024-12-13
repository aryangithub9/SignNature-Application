FROM node

WORKDIR /myapp

COPY . /myapp/

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]


