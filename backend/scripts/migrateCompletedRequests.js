const mongoose = require('mongoose');
const DocumentRequest = require('../models/DocumentRequest');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

const migrateCompletedRequests = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/documentor');
    console.log('Connected to MongoDB');

    // Find all completed requests that are not archived
    const completedRequests = await DocumentRequest.find({
      status: 'completed',
      archived: { $ne: true }
    });

    console.log(`Found ${completedRequests.length} completed requests to archive`);

    if (completedRequests.length === 0) {
      console.log('No completed requests found to migrate');
      process.exit(0);
    }

    // Archive all completed requests
    const result = await DocumentRequest.updateMany(
      {
        status: 'completed',
        archived: { $ne: true }
      },
      {
        $set: {
          archived: true,
          archivedAt: new Date(),
          archivedBy: 'System Migration',
          completedAt: new Date() // Set completedAt if not already set
        }
      }
    );

    console.log(`Successfully archived ${result.modifiedCount} completed requests`);
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the migration
migrateCompletedRequests();
