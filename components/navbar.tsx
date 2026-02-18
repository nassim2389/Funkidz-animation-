'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Funkidz
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition">
              Accueil
            </Link>
            <Link href="/services" className="text-foreground hover:text-primary transition">
              Services
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition">
              Tarifs
            </Link>
            <Link href="/gallery" className="text-foreground hover:text-primary transition">
              Galerie
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition">
              Contact
            </Link>
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                Réserver
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in duration-200">
            <Link href="/" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
              Accueil
            </Link>
            <Link href="/services" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
              Services
            </Link>
            <Link href="/pricing" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
              Tarifs
            </Link>
            <Link href="/gallery" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
              Galerie
            </Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
              Contact
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
