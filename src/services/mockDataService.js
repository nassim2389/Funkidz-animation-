// Mock Data Service for Frontend Development

const MOCK_DATA = {
  services: [
    {
      id: 1,
      title: 'Magicien',
      description: 'Un spectacle de magie interactif qui captivera les enfants',
      price: 250,
      duration_minutes: 60,
      capacity_max: 50,
      is_active: true,
    },
    {
      id: 2,
      title: 'Clown',
      description: 'Animation avec un clown professionnel pour rires garantis',
      price: 200,
      duration_minutes: 45,
      capacity_max: 40,
      is_active: true,
    },
    {
      id: 3,
      title: 'DJ & Danseur',
      description: 'Musique, danse et animations pour petits et grands',
      price: 300,
      duration_minutes: 120,
      capacity_max: 100,
      is_active: true,
    },
    {
      id: 4,
      title: 'Atelier Créatif',
      description: 'Atelier de peinture, bricolage ou jeux créatifs',
      price: 180,
      duration_minutes: 90,
      capacity_max: 30,
      is_active: true,
    },
  ],

  bookings: [
    {
      id: 1,
      booking_number: 'BK-001-2024',
      service: { id: 1, title: 'Magicien' },
      event_date: '2024-03-20',
      start_time: '14:00',
      duration_minutes: 60,
      city: 'Paris',
      children_count: 20,
      status: 'confirmed',
      final_price: 250,
      client_name: 'Jean Dupont',
      client_email: 'jean@example.com',
    },
    {
      id: 2,
      booking_number: 'BK-002-2024',
      service: { id: 2, title: 'Clown' },
      event_date: '2024-03-25',
      start_time: '15:30',
      duration_minutes: 45,
      city: 'Lyon',
      children_count: 15,
      status: 'pending',
      final_price: 200,
      client_name: 'Marie Martin',
      client_email: 'marie@example.com',
    },
    {
      id: 3,
      booking_number: 'BK-003-2024',
      service: { id: 3, title: 'DJ & Danseur' },
      event_date: '2024-04-10',
      start_time: '18:00',
      duration_minutes: 120,
      city: 'Marseille',
      children_count: 50,
      status: 'confirmed',
      final_price: 300,
      client_name: 'Pierre Bernard',
      client_email: 'pierre@example.com',
    },
  ],

  users: [
    {
      id: 2,
      email: 'user@funkidz.fr',
      firstName: 'Client',
      lastName: 'Test',
      role: 'user',
      created_at: '2024-01-15',
      total_bookings: 2,
    },
    {
      id: 3,
      email: 'client2@example.com',
      firstName: 'Sophie',
      lastName: 'Leclerc',
      role: 'user',
      created_at: '2024-02-01',
      total_bookings: 1,
    },
  ],

  payments: [
    {
      id: 1,
      booking_id: 1,
      amount: 250,
      status: 'completed',
      payment_method: 'stripe',
      created_at: '2024-03-20',
      invoice_url: '/invoices/INV-001.pdf',
    },
    {
      id: 2,
      booking_id: 2,
      amount: 200,
      status: 'pending',
      payment_method: 'stripe',
      created_at: '2024-03-25',
      invoice_url: null,
    },
  ],
};

const mockDataService = {
  // Services
  getServices: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: MOCK_DATA.services });
      }, 300);
    });
  },

  // Bookings
  getBookings: async (status = null) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let bookings = MOCK_DATA.bookings;
        if (status) {
          bookings = bookings.filter(b => b.status === status);
        }
        resolve({ data: bookings });
      }, 300);
    });
  },

  getUserBookings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: MOCK_DATA.bookings });
      }, 300);
    });
  },

  // Users
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: MOCK_DATA.users });
      }, 300);
    });
  },

  // Payments
  getPayments: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: MOCK_DATA.payments });
      }, 300);
    });
  },

  // Statistics
  getStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            total_bookings: MOCK_DATA.bookings.length,
            confirmed_bookings: MOCK_DATA.bookings.filter(b => b.status === 'confirmed').length,
            pending_bookings: MOCK_DATA.bookings.filter(b => b.status === 'pending').length,
            total_revenue: MOCK_DATA.payments
              .filter(p => p.status === 'completed')
              .reduce((sum, p) => sum + p.amount, 0),
            total_users: MOCK_DATA.users.length,
          },
        });
      }, 300);
    });
  },
};

export default mockDataService;
