import { authIsRequired } from "@/lib/auth-utils";

export default async function Home() {
  await authIsRequired();

  return (
    <div>
      <h1>home page</h1>
    </div>
  );
}
