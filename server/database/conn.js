import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

async function connect() {
    // Create an in-memory MongoDB server
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();

    // Enable strict query option
    mongoose.set('strictQuery', true);

    try {
        // Connect to the in-memory MongoDB server
        const db = await mongoose.connect(getUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database Connected:', db.connection.name);
        return db;
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit if the connection fails
    }
}

export default connect;
