import initializeEnv from './config/environmentalVariables';
initializeEnv();
import { app, db } from './loaders';


db.meta.sync().then(() => {
  console.log('db connect successfully');
  
  try {
    app.listen(process.env.PORT, () => {
      console.log(`server is working on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.error('server Fail', e);
    throw e;
  }
  
}).catch((e) => {
  console.log('db fail', e)
  throw e;
}) 
