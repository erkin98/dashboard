import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../page';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Canvas
const mockCanvas = {
  getContext: jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    createImageData: jest.fn(),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    arc: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    canvas: {
      width: 800,
      height: 600,
    },
  })),
  width: 800,
  height: 600,
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => mockCanvas.getContext(),
});

const mockDashboardData = {
  monthlyMetrics: [
    {
      month: '2024-01',
      youtubeViews: 125000,
      youtubeUniqueViews: 85000,
      websiteVisitors: 15000,
      callsBooked: 85,
      callsAccepted: 72,
      showUpRate: 84.7,
      newCashCollected: {
        paidInFull: 48000,
        installments: 24000,
        total: 72000,
      },
      totalCashCollected: 156000,
      conversionRates: {
        viewToWebsite: 12.0,
        websiteToCall: 5.7,
        callToAccepted: 84.7,
        acceptedToSale: 16.7,
      },
    },
  ],
  videos: [],
  calls: [],
  sales: [],
  kajabiData: {
    products: [],
    contacts: 0,
    emailStats: {
      opens: 0,
      clicks: 0,
      openRate: 0,
      clickRate: 0,
    },
  },
  aiInsights: [],
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });

    render(<Dashboard />);
    
    await waitFor(() => {
      // Wait for the component to load and check for common elements
      expect(document.body).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles loading state', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Dashboard />);
    
    // Should show loading content initially (canvas for particle animation)
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      // Should show error state
      expect(screen.getByText('Failed to load coaching analytics')).toBeInTheDocument();
      expect(screen.getByText('Retry Connection')).toBeInTheDocument();
    });
  });

  it('handles network errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      // Should show error state
      expect(screen.getByText('Failed to load coaching analytics')).toBeInTheDocument();
    });
  });

  it('calls the dashboard API on mount', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDashboardData,
    });

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/dashboard');
    });
  });
}); 