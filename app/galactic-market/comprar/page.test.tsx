import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ComprarModulosPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api, { hadesApi } from '../../../lib/api';

// Mock the API module
vi.mock('../../../lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  hadesApi: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('ComprarModulosPage', () => {
  const mockListings = [
    {
      listingId: 'list-1',
      moduleData: {
        type: 'energy',
        currentLevel: 1,
        stats: {
          baseVitality: 100,
          radiationResistance: 0.162
        }
      },
      price: 1000,
      description: 'Test Energy Module'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the page title and data after loading', async () => {
    (hadesApi.get as any).mockResolvedValueOnce({ data: { listings: mockListings } });
    
    render(<ComprarModulosPage />);
    
    // After loading
    await waitFor(() => {
      expect(screen.getByText(/GALACTIC/i)).toBeInTheDocument();
      expect(screen.getByText('ENERGY')).toBeInTheDocument();
      expect(screen.getByText('1000 THAO')).toBeInTheDocument();
    });
  });

  it('should handle buy button click', async () => {
    (hadesApi.get as any).mockResolvedValueOnce({ data: { listings: mockListings } });
    (hadesApi.post as any).mockResolvedValueOnce({ data: { success: true } });
    
    render(<ComprarModulosPage />);

    await waitFor(() => screen.getByText('COMPRAR'));
    
    const buyButton = screen.getByText('COMPRAR');
    fireEvent.click(buyButton);

    await waitFor(() => {
      expect(hadesApi.post).toHaveBeenCalledWith('/confirmBuyTransaction', { listingId: 'list-1' });
      expect(screen.getByText(/Estructura Forjada con Éxito/i)).toBeInTheDocument();
    });
  });

  it('should show empty state if no listings', async () => {
    (hadesApi.get as any).mockResolvedValueOnce({ data: { listings: [] } });
    
    render(<ComprarModulosPage />);

    await waitFor(() => {
      expect(screen.getByText(/No hay módulos disponibles/i)).toBeInTheDocument();
    });
  });

  it('should handle listings with missing moduleData gracefully', async () => {
    const malformedListing = [{
      listingId: 'malformed-1',
      price: 500
      // moduleData missing
    }];
    (hadesApi.get as any).mockResolvedValueOnce({ data: { listings: malformedListing } });
    
    render(<ComprarModulosPage />);

    await waitFor(() => {
      expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
    });
  });
});
