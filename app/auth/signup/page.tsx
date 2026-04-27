'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { authAPI, apiClient } from '@/lib/api-client';
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Inscription - Funkidz',
  description: 'Créer votre compte Funkidz et commencez à réserver des animateurs professionnels',
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    agree_terms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.agree_terms) {
      setError('Vous devez accepter les conditions générales');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      if (response && ('access' in response || 'token' in response)) {
        const token = 'access' in response ? response.access : response.token;
        apiClient.setToken(token);
        router.push('/dashboard');
      } else {
        setError('Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Funkidz</h1>
          <p className="text-slate-600 dark:text-slate-400">Plateforme de réservation d&apos;animateurs</p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="space-y-1 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Créer un compte</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Commencez à réserver vos animations dès maintenant
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-slate-700 dark:text-slate-300 font-medium">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Jean"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="pl-10 border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-white dark:bg-slate-900"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-slate-700 dark:text-slate-300 font-medium">Nom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Dupont"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="pl-10 border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-white dark:bg-slate-900"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-white dark:bg-slate-900"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-white dark:bg-slate-900"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirm" className="text-slate-700 dark:text-slate-300 font-medium">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
                  <Input
                    id="password_confirm"
                    name="password_confirm"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required
                    className="pl-10 border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-white dark:bg-slate-900"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="agree_terms"
                  name="agree_terms"
                  checked={formData.agree_terms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      agree_terms: checked === true,
                    }))
                  }
                  disabled={isLoading}
                  className="border-slate-300 dark:border-slate-700"
                />
                <label htmlFor="agree_terms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  J&apos;accepte les{' '}
                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    conditions générales
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  'Créer un compte'
                )}
              </Button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
                Déjà inscrit ?{' '}
                <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  Se connecter
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6">
          En créant un compte, vous acceptez notre{' '}
          <Link href="/privacy" className="hover:underline">
            politique de confidentialité
          </Link>
        </p>
      </div>
    </div>
  );
}
