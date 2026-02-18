'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { apiClient, authAPI } from '@/lib/api-client';
import { LogOut, Home, Calendar, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authAPI.me();
        setUser(userData);
      } catch {
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Logout error, but continue
    }
    apiClient.clearToken();
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } border-r border-border bg-card transition-all duration-300 hidden md:block`}
        >
          <div className="p-4 flex flex-col h-full">
            {/* User Info */}
            <div className="mb-8 pb-8 border-b border-border">
              {isSidebarOpen && (
                <>
                  <p className="text-sm text-muted-foreground mb-1">Connecté en tant que</p>
                  <p className="font-semibold truncate">
                    {user.first_name} {user.last_name}
                  </p>
                </>
              )}
            </div>

            {/* Menu */}
            <nav className="space-y-2 flex-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start" size="lg">
                  <Home size={20} className={isSidebarOpen ? 'mr-3' : ''} />
                  {isSidebarOpen && 'Accueil'}
                </Button>
              </Link>
              <Link href="/dashboard/reservations">
                <Button variant="ghost" className="w-full justify-start" size="lg">
                  <Calendar size={20} className={isSidebarOpen ? 'mr-3' : ''} />
                  {isSidebarOpen && 'Réservations'}
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="ghost" className="w-full justify-start" size="lg">
                  <User size={20} className={isSidebarOpen ? 'mr-3' : ''} />
                  {isSidebarOpen && 'Profil'}
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" className="w-full justify-start" size="lg">
                  <Settings size={20} className={isSidebarOpen ? 'mr-3' : ''} />
                  {isSidebarOpen && 'Paramètres'}
                </Button>
              </Link>
            </nav>

            {/* Logout */}
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full justify-start"
              size="lg"
            >
              <LogOut size={20} className={isSidebarOpen ? 'mr-3' : ''} />
              {isSidebarOpen && 'Déconnexion'}
            </Button>

            {/* Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mt-4 p-2 hover:bg-accent/10 rounded-lg w-full"
            >
              {isSidebarOpen ? '◄' : '►'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
