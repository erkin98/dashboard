import { render, screen, fireEvent } from '@testing-library/react';
import { AIInsights } from '../AIInsights';
import type { AIInsight } from '@/types';

const mockInsights: AIInsight[] = [
  {
    type: 'trend',
    title: 'Growing Engagement',
    description: 'Your videos are getting 25% more engagement this month compared to last month.',
    impact: 'high',
    action: 'Consider posting more frequently to capitalize on this trend.',
  },
  {
    type: 'recommendation',
    title: 'Optimize Upload Time',
    description: 'Your audience is most active between 2-4 PM EST. Consider scheduling uploads during this window.',
    impact: 'medium',
    action: 'Schedule your next 3 videos for 3 PM EST to maximize initial views.',
  },
  {
    type: 'alert',
    title: 'Conversion Rate Drop',
    description: 'Your video-to-call conversion rate has dropped by 15% this week.',
    impact: 'high',
  },
];

describe('AIInsights', () => {
  it('renders component with insights', () => {
    render(<AIInsights insights={mockInsights} />);
    
    expect(screen.getByText('AI-Powered Insights')).toBeInTheDocument();
    expect(screen.getByText('Generated from your data')).toBeInTheDocument();
  });

  it('displays insight cards correctly', () => {
    render(<AIInsights insights={mockInsights} />);
    
    expect(screen.getByText('Growing Engagement')).toBeInTheDocument();
    expect(screen.getByText('Optimize Upload Time')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate Drop')).toBeInTheDocument();
  });

  it('shows insight descriptions', () => {
    render(<AIInsights insights={mockInsights} />);
    
    expect(screen.getByText(/Your videos are getting 25% more engagement/)).toBeInTheDocument();
    expect(screen.getByText(/Your audience is most active between 2-4 PM EST/)).toBeInTheDocument();
    expect(screen.getByText(/Your video-to-call conversion rate has dropped/)).toBeInTheDocument();
  });

  it('displays impact badges correctly', () => {
    render(<AIInsights insights={mockInsights} />);
    
    // Use getAllByText for elements that appear multiple times
    const highImpactBadges = screen.getAllByText(/High.*Impact/);
    expect(highImpactBadges.length).toBe(2); // Two high impact insights
    
    const mediumImpactBadges = screen.getAllByText(/Medium.*Impact/);
    expect(mediumImpactBadges.length).toBe(1); // One medium impact insight
  });

  it('shows recommended actions when provided', () => {
    render(<AIInsights insights={mockInsights} />);
    
    // Use getAllByText since "Recommended Action:" appears multiple times
    const recommendedActions = screen.getAllByText('Recommended Action:');
    expect(recommendedActions.length).toBe(2); // Two insights have actions
    
    expect(screen.getByText(/Consider posting more frequently/)).toBeInTheDocument();
    expect(screen.getByText(/Schedule your next 3 videos/)).toBeInTheDocument();
  });

  it('renders different insight types with appropriate colors', () => {
    render(<AIInsights insights={mockInsights} />);
    
    // Check for insight cards by finding their content and checking parent styling
    const trendCard = screen.getByText('Growing Engagement').closest('div[class*="bg-cyan-500/20"]');
    expect(trendCard).toBeInTheDocument();
    
    const recommendationCard = screen.getByText('Optimize Upload Time').closest('div[class*="bg-purple-500/20"]');
    expect(recommendationCard).toBeInTheDocument();
    
    const alertCard = screen.getByText('Conversion Rate Drop').closest('div[class*="bg-red-500/20"]');
    expect(alertCard).toBeInTheDocument();
  });

  it('displays empty state when no insights are provided', () => {
    render(<AIInsights insights={[]} />);
    
    expect(screen.getByText('No Insights Available')).toBeInTheDocument();
    expect(screen.getByText(/Check back after more data is collected for AI-powered recommendations/)).toBeInTheDocument();
  });

  it('shows generate new insights button', () => {
    render(<AIInsights insights={mockInsights} />);
    
    const generateButton = screen.getByText('Generate New Insights');
    expect(generateButton).toBeInTheDocument();
    expect(generateButton.tagName).toBe('BUTTON');
  });

  it('handles button click events', () => {
    render(<AIInsights insights={mockInsights} />);
    
    const generateButton = screen.getByText('Generate New Insights');
    fireEvent.click(generateButton);
    
    // Button should still be in the document after click
    expect(generateButton).toBeInTheDocument();
  });

  it('displays impact levels correctly', () => {
    const mixedImpactInsights: AIInsight[] = [
      {
        type: 'trend',
        title: 'High Impact Trend',
        description: 'Test',
        impact: 'high',
      },
      {
        type: 'recommendation',
        title: 'Medium Impact Rec',
        description: 'Test',
        impact: 'medium',
      },
      {
        type: 'alert',
        title: 'Low Impact Alert',
        description: 'Test',
        impact: 'low',
      },
    ];

    render(<AIInsights insights={mixedImpactInsights} />);
    
    // Check for insight titles to ensure they're rendered
    expect(screen.getByText('High Impact Trend')).toBeInTheDocument();
    expect(screen.getByText('Medium Impact Rec')).toBeInTheDocument();
    expect(screen.getByText('Low Impact Alert')).toBeInTheDocument();
    
    // Check for impact level badges using getAllByText since there can be multiple matches
    const highBadges = screen.getAllByText(/High.*Impact/);
    expect(highBadges.length).toBeGreaterThan(0);
    
    const mediumBadges = screen.getAllByText(/Medium.*Impact/);
    expect(mediumBadges.length).toBeGreaterThan(0);
    
    const lowBadges = screen.getAllByText(/Low.*Impact/);
    expect(lowBadges.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = render(<AIInsights insights={mockInsights} className="custom-insights" />);
    
    // Check if custom class is applied to the root element
    expect(container.firstChild).toHaveClass('custom-insights');
  });
}); 