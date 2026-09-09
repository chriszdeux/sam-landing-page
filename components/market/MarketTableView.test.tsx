import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../tests/utils/render-with-providers';
import { MarketTableView } from './MarketTableView';
import { Cryptocurrency } from '../../lib/types/crypto';

// Solo los campos que la tabla lee; el resto del tipo no participa en el render.
const buildCrypto = (logo?: string): Cryptocurrency =>
  ({
    id: 'crypto-1',
    identification: { name: 'Sam Coin', symbol: 'SAM', logo },
    financial: { price: 1, change24h: 0 },
    network: { id: 'net-1', name: 'SamNet' },
    isActive: true,
  } as unknown as Cryptocurrency);

const renderTable = (crypto: Cryptocurrency) =>
  renderWithProviders(
    <MarketTableView cryptos={[crypto]} onTrade={vi.fn()} onRowClick={vi.fn()} />
  );

describe('MarketTableView: fallback de logo', () => {
  it('muestra la imagen del logo cuando la URL carga sin problemas', () => {
    renderTable(buildCrypto('https://pub-test.r2.dev/crypto/sam.png'));

    expect(screen.getByAltText('Sam Coin')).toBeInTheDocument();
  });

  it('cae a la inicial del simbolo cuando la imagen dispara onError', () => {
    const { container } = renderTable(buildCrypto('https://clim-v1.s3.us-east-2.amazonaws.com/muerta.png'));

    const image = screen.getByAltText('Sam Coin');
    fireEvent.error(image);

    expect(screen.queryByAltText('Sam Coin')).not.toBeInTheDocument();
    expect(container.querySelector('th[scope="row"]')).toHaveTextContent('S');
  });

  it('cae a la inicial del simbolo cuando no hay logo', () => {
    const { container } = renderTable(buildCrypto(undefined));

    expect(screen.queryByAltText('Sam Coin')).not.toBeInTheDocument();
    expect(container.querySelector('th[scope="row"]')).toHaveTextContent('S');
  });
});
