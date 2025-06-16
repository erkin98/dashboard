import { render, screen } from '@testing-library/react';
import { VideoPerformanceTable } from '../VideoPerformanceTable';
import type { YouTubeVideo } from '@/types';

const mockVideos: YouTubeVideo[] = [
  {
    id: '1',
    title: 'How to Get More Coaching Clients',
    publishedAt: '2024-01-15',
    views: 125000,
    uniqueViews: 85000,
    leadsGenerated: 1500,
    callsBooked: 85,
    callsAccepted: 12,
    salesClosed: 12,
    revenue: 48000,
    conversionRate: 14.1,
    revenuePerView: 0.384,
  },
  {
    id: '2',
    title: 'Advanced Sales Techniques',
    publishedAt: '2024-01-08',
    views: 95000,
    uniqueViews: 65000,
    leadsGenerated: 1200,
    callsBooked: 65,
    callsAccepted: 8,
    salesClosed: 8,
    revenue: 32000,
    conversionRate: 12.3,
    revenuePerView: 0.337,
  },
  {
    id: '3',
    title: 'Building Your Personal Brand',
    publishedAt: '2024-01-01',
    views: 78000,
    uniqueViews: 52000,
    leadsGenerated: 980,
    callsBooked: 45,
    callsAccepted: 6,
    salesClosed: 5,
    revenue: 20000,
    conversionRate: 11.1,
    revenuePerView: 0.256,
  },
];

describe('VideoPerformanceTable', () => {
  it('renders table headers correctly', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    expect(screen.getByText('Video Performance Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Rank')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('displays video data correctly', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    expect(screen.getByText('How to Get More Coaching Clients')).toBeInTheDocument();
    expect(screen.getByText('Advanced Sales Techniques')).toBeInTheDocument();
    expect(screen.getByText('Building Your Personal Brand')).toBeInTheDocument();
  });

  it('formats large numbers correctly', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    expect(screen.getByText('125K')).toBeInTheDocument();
    // The component formats numbers with K/M suffixes, not comma separators
    expect(screen.getByText('95K')).toBeInTheDocument();
  });

  it('displays rank badges correctly', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    // Look for rank badges using more specific selectors
    const rankBadges = screen.getAllByText('1');
    expect(rankBadges.length).toBeGreaterThan(0);
    
    // Check for rank 1 badge specifically
    const rankOneBadge = rankBadges.find(el => 
      el.closest('span')?.classList.contains('from-amber-400')
    );
    expect(rankOneBadge).toBeInTheDocument();
  });

  it('shows performance ratings', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    // Look for rating badges - component should show "Excellent" for high performers
    const excellentRatings = screen.getAllByText('Excellent');
    expect(excellentRatings.length).toBeGreaterThan(0);
  });

  it('formats currency correctly', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    // Component uses formatCurrency which formats as full dollar amounts with commas
    expect(screen.getByText('$48,000')).toBeInTheDocument();
    expect(screen.getByText('$32,000')).toBeInTheDocument();
    expect(screen.getByText('$20,000')).toBeInTheDocument();
  });

  it('displays total videos count', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    expect(screen.getByText('Total videos analyzed:')).toBeInTheDocument();
    // Look for the total count in the specific context
    const totalCountElement = screen.getByText('Total videos analyzed:').parentElement;
    expect(totalCountElement).toHaveTextContent('3');
  });

  it('shows top 10 limit message', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    // Check for the message about showing top performers
    expect(screen.getByText('Showing top 10 performing videos')).toBeInTheDocument();
  });

  it('displays table when videos provided', () => {
    render(<VideoPerformanceTable videos={mockVideos} />);
    
    // When videos are provided, table should be shown (not empty state)
    expect(screen.getByText('Video Performance Leaderboard')).toBeInTheDocument();
    expect(screen.queryByText('No video data available')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<VideoPerformanceTable videos={mockVideos} className="custom-table" />);
    
    // Check if custom class is applied to the container
    expect(container.firstChild).toHaveClass('custom-table');
  });
}); 