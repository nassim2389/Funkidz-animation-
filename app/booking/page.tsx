'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import mockDataService from '@/src/services/mockDataService.js';
import { Calendar, Clock, Users, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  base_price: number;
  duration: number;
}

interface ServiceOption {
  id: number;
  name: string;
  price: number;
}

interface FormData {
  service_id: number | '';
  date: string;
  time: string;
  duration: number;
  guest_count: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  notes: string;
  selected_options: number[];
  agree_terms: boolean;
}

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [options, setOptions] = useState<ServiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    service_id: '',
    date: '',
    time: '10:00',
    duration: 2,
    guest_count: 20,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    notes: '',
    selected_options: [],
    agree_terms: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes] = await Promise.all([
          mockDataService.getServices(),
        ]);
        setServices(servicesRes.data);
        setOptions([]); // Pas d'options mock pour l'instant
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total price
  useEffect(() => {
    if (formData.service_id) {
      const selectedService = services.find((s) => s.id === Number(formData.service_id));
      let price = (selectedService?.base_price || 0) * formData.duration;

      const selectedServiceOptions = options.filter((o) =>
        formData.selected_options.includes(o.id)
      );
      price += selectedServiceOptions.reduce((sum, opt) => sum + opt.price, 0);

      setTotalPrice(price);
    }
  }, [formData.service_id, formData.duration, formData.selected_options, services, options]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'service_id' ? (value ? Number(value) : '') : value,
    }));
  };

  const handleOptionToggle = (optionId: number) => {
    setFormData((prev) => ({
      ...prev,
      selected_options: prev.selected_options.includes(optionId)
        ? prev.selected_options.filter((id) => id !== optionId)
        : [...prev.selected_options, optionId],
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agree_terms: checked === true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.agree_terms) {
      setError('Vous devez accepter les conditions générales');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler la création de réservation avec le mock
      setTimeout(() => {
        setSuccess(true);
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réservation');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12">
          <Loader2 className="animate-spin" size={48} />
        </div>
        <Footer />
      </main>
    );
  }

  if (success) {
    return (
      <main className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-8">
              <CheckCircle className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl font-bold mb-2">Réservation Confirmée</h2>
              <p className="text-muted-foreground mb-6">
                Votre réservation a été créée avec succès. Vous recevrez un email de confirmation.
              </p>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                Retour à l&apos;accueil
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Réserver une Animation</h1>
              <p className="text-muted-foreground">
                Configurez votre événement en quelques minutes
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails de la Réservation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="flex gap-3 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                          <AlertCircle size={20} className="flex-shrink-0" />
                          <p className="text-sm">{error}</p>
                        </div>
                      )}

                      {/* Service Selection */}
                      <div className="space-y-2">
                        <Label>Service</Label>
                        <Select
                          value={String(formData.service_id)}
                          onValueChange={(value) => handleSelectChange('service_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={String(service.id)}>
                                {service.name} - {service.base_price}€/heure
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Heure</Label>
                          <Input
                            id="time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Duration and Guest Count */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="duration">Durée (heures)</Label>
                          <Input
                            id="duration"
                            name="duration"
                            type="number"
                            min="1"
                            max="8"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guest_count">Nombre de participants</Label>
                          <Input
                            id="guest_count"
                            name="guest_count"
                            type="number"
                            min="1"
                            max="500"
                            value={formData.guest_count}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Options */}
                      {options.length > 0 && (
                        <div className="space-y-3">
                          <Label>Options Supplémentaires</Label>
                          <div className="space-y-2">
                            {options.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/5"
                              >
                                <Checkbox
                                  id={`option-${option.id}`}
                                  checked={formData.selected_options.includes(option.id)}
                                  onCheckedChange={() => handleOptionToggle(option.id)}
                                />
                                <label
                                  htmlFor={`option-${option.id}`}
                                  className="flex-1 cursor-pointer flex justify-between"
                                >
                                  <span className="font-medium">{option.name}</span>
                                  <span className="text-primary font-semibold">+{option.price}€</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Client Info */}
                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-4">Vos Informations</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name">Prénom</Label>
                            <Input
                              id="first_name"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name">Nom</Label>
                            <Input
                              id="last_name"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2 mb-4">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2 mb-4">
                          <Label htmlFor="address">Adresse</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="postal_code">Code postal</Label>
                            <Input
                              id="postal_code"
                              name="postal_code"
                              value={formData.postal_code}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">Ville</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (optionnel)</Label>
                        <textarea
                          id="notes"
                          name="notes"
                          className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Détails supplémentaires sur votre événement..."
                          value={formData.notes}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Terms */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agree_terms"
                          checked={formData.agree_terms}
                          onCheckedChange={handleCheckboxChange}
                        />
                        <label htmlFor="agree_terms" className="text-sm text-muted-foreground">
                          J&apos;accepte les{' '}
                          <a href="/terms" className="text-primary hover:underline">
                            conditions générales
                          </a>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 text-lg py-6"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          'Procéder au Paiement'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <div>
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Résumé</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {formData.service_id && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Service</p>
                          <p className="font-semibold">
                            {services.find((s) => s.id === Number(formData.service_id))?.name}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{formData.date || 'Non défini'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {formData.time} - {formData.duration}h
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{formData.guest_count} personnes</p>
                          </div>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Service de base</span>
                            <span>
                              {(
                                (services.find((s) => s.id === Number(formData.service_id))?.base_price || 0) *
                                formData.duration
                              ).toFixed(2)}
                              €
                            </span>
                          </div>

                          {formData.selected_options.map((optionId) => {
                            const option = options.find((o) => o.id === optionId);
                            return (
                              <div key={optionId} className="flex justify-between text-sm">
                                <span>{option?.name}</span>
                                <span>{option?.price}€</span>
                              </div>
                            );
                          })}

                          <div className="border-t pt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {totalPrice.toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
