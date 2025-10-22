import { db } from './src/lib/db';

async function checkUsers() {
  const users = await db.user.findMany({ select: { email: true, role: true } });
  console.log('Users:', JSON.stringify(users, null, 2));
}

checkUsers().catch(console.error);