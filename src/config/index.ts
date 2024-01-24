let dbURL: string;
import dotenv from 'dotenv';
dotenv.config();
if (true)
    dbURL =
        process?.env?.DB_CONN_STRING ?? ""
else dbURL = 'mongodb://localhost:27017';
export default {
    dbURL,
};