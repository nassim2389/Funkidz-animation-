'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import mockDataService from '@/src/services/mockDataService.js';
import mockAuthService from '@/src/services/mockAuthService.js';
import { BarChart3, Users, Calendar, DollarSign, LogOut, Settings, Plus } from 'lucide-react';

interface AdminStats {
  total_reservations: number;
  pending_reservations: number;
  total_revenue: number;
  total_services: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    total_reservations: 0,
    pending_reservations: 0,
    total_revenue: 0,
    total_services: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Utiliser les mocks pour les réservations et services
        const [reservationsRes, servicesRes] = await Promise.all([
          mockDataService.getBookings(),
          mockDataService.getServices(),
        ]);
        const reservations = reservationsRes.data;
        const services = servicesRes.data;
        // Calculate stats
        const pending = reservations.filter((r: any) => r.status === 'pending').length;
        const revenue = reservations.reduce((sum: number, r: any) => sum + (r.final_price || 0), 0);
        setStats({
          total_reservations: reservations.length,
          pending_reservations: pending,
          total_revenue: revenue,
          total_services: services.length,
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await mockAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Tableau de Bord Admin</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Gestion Funkidz</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut size={18} />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-600 dark:text-slate-400 mt-3">Chargement des données...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Réservations Totales</CardTitle>
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_reservations}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Tous les temps</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">En Attente</CardTitle>
                  <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pending_reservations}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">À traiter</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Revenu</CardTitle>
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_revenue}€</div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Total généré</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Services</CardTitle>
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total_services}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Actifs</p>
                </CardContent>
              </Card>
            </div>

            {/* Management Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Reservations Management */}
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-slate-900 dark:text-white">Gestion des Réservations</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Approuver ou modifier les réservations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Link href="/admin/reservations">
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold">
                        <Calendar className="mr-2" size={18} />
                        Voir Toutes les Réservations
                      </Button>
                    </Link>
                    <div className="text-sm text-amber-700 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                      {stats.pending_reservations} réservation{stats.pending_reservations !== 1 ? 's' : ''} en attente d'approbation
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Management */}
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-slate-900 dark:text-white">Gestion des Services</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Créer, modifier ou supprimer les services</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Link href="/admin/services">
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold">
                        <Users className="mr-2" size={18} />
                        Gérer les Services
                      </Button>
                    </Link>
                    <div className="text-sm text-blue-700 dark:text-blue-400 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                      {stats.total_services} service{stats.total_services !== 1 ? 's' : ''} disponible{stats.total_services !== 1 ? 's' : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-slate-900 dark:text-white">Analytics & Rapports</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Visualiser les statistiques et tendances</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Link href="/admin/analytics">
                    <Button className="w-full justify-start bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-semibold">
                      <BarChart3 className="mr-2" size={18} />
                      Voir les Analytics
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-slate-900 dark:text-white">Paramètres</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Configuration du système et options</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Link href="/admin/settings">
                    <Button className="w-full justify-start bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-semibold">
                      <Settings className="mr-2" size={18} />
                      Gérer les Paramètres
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                <CardTitle className="text-slate-900 dark:text-white">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-4 gap-3">
                  <Link href="/admin/reservations">
                    <Button variant="outline" className="w-full border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">
                      Réservations
                    </Button>
                  </Link>
                  <Link href="/admin/services">
                    <Button variant="outline" className="w-full border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                      <Plus size={16} />
                      Service
                    </Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button variant="outline" className="w-full border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">
                      Paiement
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">
                      Retour au Site
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
