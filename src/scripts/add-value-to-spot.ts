import mongoose from 'mongoose';
import Team from '@/app/api/_model/team.model';

const MONGODB_URI = process.env.MONGODB_URI as string

async function runUpdate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const teamsToUpdate = await Team.find({ spotArray: { $size: 5 } });

    console.log(`Found ${teamsToUpdate.length} teams to update`, teamsToUpdate[0]);

    for (const team of teamsToUpdate) {
      if (!team.spotArray.includes('faaah')) {
        team.spotArray.push('faaah');
        await team.save();
        console.log(`Updated team: ${team.teamName}`);
      } else {
        console.log(`Skipped team (already has value): ${team.teamName}`);
      }
    }
  } catch (error) {
    console.error('Error updating teams:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

runUpdate();
