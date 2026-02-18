'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import mockDataService from '@/src/services/mockDataService.js';
import { Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">Gérez vos réservations et événements</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total des Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Réservations Récentes</CardTitle>
              <CardDescription>Vos événements à venir</CardDescription>
            </div>
            <Link href="/booking">
              <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                Nouvelle Réservation
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Vous n&apos;avez pas encore de réservations</p>
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                  Réserver une Animation
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{reservation.service.name}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(reservation.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {reservation.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{reservation.total_price}€</div>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      {reservation.status === 'confirmed' ? (
                        <>
                          <CheckCircle size={12} className="text-green-600" />
                          <span className="text-green-600">Confirmée</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} className="text-orange-600" />
                          <span className="text-orange-600">En Attente</span>
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
  );
}
