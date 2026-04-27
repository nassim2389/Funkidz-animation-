'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import mockDataService from '@/src/services/mockDataService.js';
import { Calendar, Users, CheckCircle, AlertCircle, Plus } from 'lucide-react';

interface Reservation {
  id: number;
  service: {
    name: string;
  };
  date: string;
  time: string;
  status: string;
  total_price: number;
}

export default function DashboardHome() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await mockDataService.getBookings();
        const data = res.data;
        setReservations(data);
        setStats({
          total: data.length,
          confirmed: data.filter((r: Reservation) => r.status === 'confirmed').length,
          pending: data.filter((r: Reservation) => r.status === 'pending').length,
        });
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="p-8 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">Tableau de Bord</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Gérez vos réservations et événements</p>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total des Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Confirmées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{stats.confirmed}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations List */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Réservations Récentes</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Vos événements à venir</CardDescription>
              </div>
              <Link href="/booking">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
                  <Plus size={18} />
                  Nouvelle Réservation
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-3">Chargement...</p>
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto mb-4 text-slate-400 dark:text-slate-600" />
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">Vous n&apos;avez pas encore de réservations</p>
                <Link href="/booking">
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold flex items-center gap-2 mx-auto">
                    <Plus size={18} />
                    Réserver une Animation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800/50 transition bg-slate-50/30 dark:bg-slate-900/50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{reservation.service.name}</h3>
                      <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
                          {new Date(reservation.date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-2">
                          <Users size={16} className="text-blue-600 dark:text-blue-400" />
                          {reservation.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 dark:text-blue-400 text-lg">{reservation.total_price}€</div>
                      <div className="flex items-center gap-2 mt-2 text-xs justify-end">
                        {reservation.status === 'confirmed' ? (
                          <>
                            <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Confirmée</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} className="text-amber-600 dark:text-amber-400" />
                            <span className="text-amber-600 dark:text-amber-400 font-medium">En Attente</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
