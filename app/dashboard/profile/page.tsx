//C:\Users\mukas\Downloads\project-bolt-sb1-guerg2d9\project\app\dashboard\profile\page.ts

import EnhancedProfilePage from '@/components/EnhancedProfilePage';
import initSupabase from '@/utils/client-side-client';

export default async function ProfilePage() {

  const {data:{session}} = await initSupabase.auth.getSession()

  if(!session){
    //logout
    console.log("=========LOG OUT===========")
  }
  return <EnhancedProfilePage user={session?.user} />;
}