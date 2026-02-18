'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import mockDataService from '@/src/services/mockDataService.js';
import mockAuthService from '@/src/services/mockAuthService.js';
import { BarChart3, Users, Calendar, DollarSign, LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Gestion de Funkidz Animation</p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={18} />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement des données...</div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Réservations Totales</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_reservations}</div>
                  <p className="text-xs text-muted-foreground">Tous les temps</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pending_reservations}</div>
                  <p className="text-xs text-muted-foreground">À traiter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Revenu</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_revenue}€</div>
                  <p className="text-xs text-muted-foreground">Total généré</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Services</CardTitle>
                  <Users className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_services}</div>
                  <p className="text-xs text-muted-foreground">Actifs</p>
                </CardContent>
              </Card>
            </div>

            {/* Management Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Reservations Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Réservations</CardTitle>
                  <CardDescription>Approuver, rejeter ou modifier les réservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/admin/reservations">
                      <Button className="w-full justify-start bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                        <Calendar className="mr-2" size={18} />
                        Voir Toutes les Réservations
                      </Button>
                    </Link>
                    <div className="text-sm text-muted-foreground p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      {stats.pending_reservations} réservation{stats.pending_reservations !== 1 ? 's' : ''} en attente d'approbation
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Services</CardTitle>
                  <CardDescription>Créer, modifier ou supprimer les services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/admin/services">
                      <Button className="w-full justify-start bg-gradient-to-r from-secondary to-accent text-secondary-foreground hover:opacity-90">
                        <Users className="mr-2" size={18} />
                        Gérer les Services
                      </Button>
                    </Link>
                    <div className="text-sm text-muted-foreground p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      {stats.total_services} service{stats.total_services !== 1 ? 's' : ''} disponible{stats.total_services !== 1 ? 's' : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Rapports</CardTitle>
                  <CardDescription>Visualiser les statistiques et tendances</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/analytics">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="mr-2" size={18} />
                      Voir les Analytics
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres</CardTitle>
                  <CardDescription>Configuration du système et options</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/settings">
                    <Button className="w-full justify-start" variant="outline">
                      Gérer les Paramètres
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-3">
                  <Link href="/admin/reservations">
                    <Button variant="outline" className="w-full">
                      Réservations Récentes
                    </Button>
                  </Link>
                  <Link href="/admin/services">
                    <Button variant="outline" className="w-full">
                      Ajouter un Service
                    </Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button variant="outline" className="w-full">
                      Options de Paiment
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
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
