import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { getServerSession } from "@/lib/get-session";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Check if user is signed in
  const session = await getServerSession();
  return (
    <div className="flex min-h-screen flex-col">
      {session && <Header />}
      {children}

      {session && <Footer />}
    </div>
  );
}
