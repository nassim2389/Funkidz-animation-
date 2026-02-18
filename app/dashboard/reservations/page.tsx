'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import mockDataService from '@/src/services/mockDataService.js';
import { Calendar, Clock, Users, MapPin, FileText, ArrowLeft } from 'lucide-react';

interface Reservation {
  id: number;
  service: {
    name: string;
  };
  date: string;
  time: string;
  duration: number;
  guest_count: number;
  client_address: string;
  client_city: string;
  status: string;
  total_price: number;
  notes: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await mockDataService.getBookings();
        setReservations(res.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const filteredReservations =
    selectedStatus === 'all'
      ? reservations
      : reservations.filter((r) => r.status === selectedStatus);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          label: 'Confirmée',
        };
      case 'pending':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          label: 'En Attente',
        };
      case 'rejected':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          label: 'Rejetée',
        };
      case 'cancelled':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          label: 'Annulée',
        };
      default:
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          label: status,
        };
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft size={18} />
          Retour au tableau de bord
        </Link>
        <h1 className="text-4xl font-bold mb-2">Vos Réservations</h1>
        <p className="text-muted-foreground">Gérez tous vos événements réservés</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button
          variant={selectedStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('all')}
          className={selectedStatus === 'all' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
        >
          Tous ({reservations.length})
        </Button>
        <Button
          variant={selectedStatus === 'confirmed' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('confirmed')}
          className={selectedStatus === 'confirmed' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          Confirmées ({reservations.filter((r) => r.status === 'confirmed').length})
        </Button>
        <Button
          variant={selectedStatus === 'pending' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('pending')}
          className={selectedStatus === 'pending' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        >
          En Attente ({reservations.filter((r) => r.status === 'pending').length})
        </Button>
        <Button
          variant={selectedStatus === 'cancelled' ? 'default' : 'outline'}
          onClick={() => setSelectedStatus('cancelled')}
          className={selectedStatus === 'cancelled' ? 'bg-gray-600 hover:bg-gray-700' : ''}
        >
          Annulées ({reservations.filter((r) => r.status === 'cancelled').length})
        </Button>
      </div>

      {/* Reservations */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement des réservations...</div>
      ) : filteredReservations.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-4">
              {selectedStatus === 'all'
                ? 'Vous n\'avez pas encore de réservations'
                : `Aucune réservation ${selectedStatus}`}
            </p>
            <Link href="/booking">
              <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                Nouvelle Réservation
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const badge = statusBadge(reservation.status);
            return (
              <Card key={reservation.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{reservation.service.name}</CardTitle>
                      <CardDescription>Réservation #{reservation.id}</CardDescription>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text} border ${badge.border}`}
                    >
                      {badge.label}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex gap-3 items-start">
                        <Calendar size={20} className="text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-semibold">
                            {new Date(reservation.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <Clock size={20} className="text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Heure & Durée</p>
                          <p className="font-semibold">
                            {reservation.time} - {reservation.duration}h
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <Users size={20} className="text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Participants</p>
                          <p className="font-semibold">{reservation.guest_count} personnes</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex gap-3 items-start">
                        <MapPin size={20} className="text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Lieu</p>
                          <p className="font-semibold">
                            {reservation.client_address}
                            <br />
                            {reservation.client_city}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <FileText size={20} className="text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-semibold text-lg text-primary">{reservation.total_price}€</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {reservation.notes && (
                    <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{reservation.notes}</p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Voir Détails
                    </Button>
                    {reservation.status === 'pending' && (
                      <Button variant="destructive" className="flex-1">
                        Annuler
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
