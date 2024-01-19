import { Button } from "@nextui-org/react";
import * as actions from "./actions";
import { auth } from "@/auth";
import Profile from "@/components/profile";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      {/* sign in  */}
      <form action={actions.signIn}>
        <Button type="submit">Sign In</Button>
      </form>
      {/* sign out */}
      <form action={actions.signOut}>
        <Button type="submit">Sign Out</Button>
      </form>
      {/* make sure session object is defined */}
      {session?.user ? <div>{JSON.stringify(session.user)}</div> : <div>signed out</div>}
      <Profile />
    </div>
  );
}
