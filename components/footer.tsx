'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-100 mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Funkidz
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plateforme de réservation d&apos;animateurs professionnels. Qualité, confiance et transparence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition duration-200">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-white transition duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white transition duration-200">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition duration-200">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">Légal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition duration-200">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition duration-200">
                  Conditions d&apos;Utilisation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <Phone size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">+33 1 42 68 53 00</span>
              </li>
              <li className="flex gap-3 items-start">
                <Mail size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@funkidz.fr" className="text-slate-300 hover:text-white transition">contact@funkidz.fr</a>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">75002 Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © 2024 Funkidz. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition duration-200">
                LinkedIn
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition duration-200">
                Twitter
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition duration-200">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
              </li>
              <li className="flex gap-2 items-start">
                <MapPin size={16} className="text-primary mt-0.5" />
                <span className="text-muted-foreground">75002 Paris, Île-de-France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Funkidz. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
