import mongoose from 'mongoose';
import Team from '@/app/api/_model/team.model';

const MONGODB_URI = 'mongodb+srv://debayan:debayan123@cluster0.aejkb.mongodb.net/THunt?retryWrites=true&w=majority&appName=Cluster0'

async function runUpdate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const teamsToUpdate = await Team.find({ spotArray: { $size: 6 } });

    console.log(`Found ${teamsToUpdate.length} teams to update`, teamsToUpdate[0]);

    for (const team of teamsToUpdate) {

    //   if (team.hintsLeft == null) {
        team.hintsLeft = 3;
        await team.save();
        console.log(`Updated team: ${team.teamName}`);
    //   } else {
    //     console.log(`Skipped team (already updated): ${team.teamName}`);
    //   }
    }
  } catch (error) {
    console.error('Error updating teams:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

runUpdate();
