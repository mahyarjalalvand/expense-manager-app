import { authClient } from "@/lib/auth-client";

function AuthTest() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return <div>Loading ...</div>;
  }
  if (!session) {
    return <div>not authenticated</div>;
  }
  return (
    <div>
      <p>logged in as: {session.user.name}</p>
      <p>{session.user.email}</p>
    </div>
  );
}

export default AuthTest;
