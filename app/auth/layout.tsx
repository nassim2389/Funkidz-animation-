import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12">
        {children}
      </div>
      <Footer />
    </main>
  );
}
