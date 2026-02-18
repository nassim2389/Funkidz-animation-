'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-background min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Nous Contacter
            </h1>
            <p className="text-xl text-muted-foreground">
              Une question ? Une demande spéciale ? Contactez-nous pour discuter de votre événement.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 p-2.5 mb-4">
                  <Phone className="w-full h-full text-primary" />
                </div>
                <CardTitle>Téléphone</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="tel:+33123456789" className="text-primary hover:underline text-lg font-semibold">
                  +33 (0)1 23 45 67 89
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Disponible du lundi au vendredi, 9h-18h
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 p-2.5 mb-4">
                  <Mail className="w-full h-full text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="mailto:info@funkidz.fr" className="text-primary hover:underline text-lg font-semibold">
                  info@funkidz.fr
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Réponse sous 24h en jours ouvrables
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 p-2.5 mb-4">
                  <MapPin className="w-full h-full text-primary" />
                </div>
                <CardTitle>Adresse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Paris, France</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Nous servons toute la région Île-de-France
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un Message</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'success' && (
                    <div className="flex gap-3 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <p>Votre message a été envoyé avec succès. Nous vous répondrons bientôt.</p>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex gap-3 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom Complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jean@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 (0)1 23 45 67 89"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="reservation">Question sur ma réservation</option>
                      <option value="customization">Événement sur mesure</option>
                      <option value="availability">Disponibilité</option>
                      <option value="pricing">Question tarifaire</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre demande..."
                      required
                      disabled={isSubmitting}
                      rows={6}
                      className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 text-lg py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={18} />
                        Envoyer le Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Hours */}
          <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                <CardTitle>Horaires d&apos;Ouverture</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Lundi - Vendredi</p>
                  <p className="font-semibold">9h00 - 18h00</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Samedi - Dimanche</p>
                  <p className="font-semibold">Sur rendez-vous</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}
