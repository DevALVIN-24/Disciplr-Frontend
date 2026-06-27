import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';

vi.mock('../Wallet/WalletConnectButton', () => ({
  WalletConnectButton: () => <button type="button">Connect wallet</button>,
}));

describe('Layout component navigation', () => {
  test('transactions link receives active class and aria-current when on /transactions', () => {
    render(
      <MemoryRouter initialEntries={['/transactions']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /transactions/i });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('active');
  });

  test('transactions link is not active on other routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /transactions/i });
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveClass('active');
  });

  test('header links share the common focusable classes for keyboard users', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /^home$/i });
    const analyticsLink = screen.getByRole('link', { name: /^analytics$/i });
    const transactionsLink = screen.getByRole('link', { name: /^transactions$/i });

    [homeLink, analyticsLink, transactionsLink].forEach((link) => {
      link.focus();
      expect(link).toHaveFocus();
      expect(link).toHaveClass('header-link');
    });

    fireEvent.keyDown(transactionsLink, { key: 'Enter' });
    expect(transactionsLink).toHaveAttribute('href', '/transactions');
  });
});
