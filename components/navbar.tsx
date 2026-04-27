'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              Funkidz
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition">
              Accueil
            </Link>
            <Link href="/services" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition">
              Services
            </Link>
            <Link href="/pricing" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition">
              Tarifs
            </Link>
            <Link href="/about" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition">
              À Propos
            </Link>
            <Link href="/contact" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition">
              Contact
            </Link>
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="font-semibold border-slate-300 dark:border-slate-700">
                Connexion
              </Button>
            </Link>
            <Link href="/booking">
              <Button className="font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                Réserver
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={24} className="text-slate-900 dark:text-white" /> : <Menu size={24} className="text-slate-900 dark:text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in duration-200">
            <Link href="/" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">
              Accueil
            </Link>
            <Link href="/services" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">
              Services
            </Link>
            <Link href="/pricing" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">
              Tarifs
            </Link>
            <Link href="/about" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">
              À Propos
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4 px-4">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full font-semibold">
                  Connexion
                </Button>
              </Link>
              <Link href="/booking" className="w-full">
                <Button className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
            </Link>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
