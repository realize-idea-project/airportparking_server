import dotenv from 'dotenv';
import path from 'path';

const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

const initializeEnv = () => {
	const env = process.env.NODE_ENV || PRODUCTION;
	
	switch (env) {
		case PRODUCTION:
			dotenv.config({ path: path.join(__dirname, `../../.env.production`) });
			break;
		case DEVELOPMENT:
			dotenv.config({ path: path.join(__dirname, `../../.env.development`) });
			break;
		default:
			throw new Error('NODE_ENV did not set');
	}	
};

export default initializeEnv;