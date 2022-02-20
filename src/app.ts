import initializeEnv from './config/environmentalVariables';
initializeEnv();

import { app, db } from './loaders';

console.log('test: ', process.env.NODE_ENV, process.env.PORT, process.env.DB_HOST)
db.meta.sync().then(() => {
  console.log('db connect successfully');
  
  app.listen(process.env.PORT, () => {
    console.log(`server is working on port ${process.env.PORT}`);
  });
}).catch((e) => {
  console.log('server or db fail')
  console.log(e);
}) 
