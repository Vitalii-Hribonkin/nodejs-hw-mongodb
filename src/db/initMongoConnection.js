import { getEnvVar } from '../utils/getEnvVar.js';
import mongoose from 'mongoose';

export const initMongoConection = async() => {
    try {
       const user = getEnvVar('MONGODB_USER');
        const password = getEnvVar('MONGODB_PASSWORD');
        const url = getEnvVar('MONGODB_URL');
        const dbName = getEnvVar('MONGODB_DB');


        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`);
        console.log('✅ Successfully conected to databse');
    } catch (error) {
        console.log(`❌ ${error.message}`);
        throw error;
    }
};