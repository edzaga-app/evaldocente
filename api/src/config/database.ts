import config from './config';

const db = {
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    connectString: `(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=${config.DB_HOST})(PORT=${config.DB_PORT})))(CONNECT_DATA=(SERVICE_NAME=${config.DB_SERVICE_NAME})))`
}

export default db;