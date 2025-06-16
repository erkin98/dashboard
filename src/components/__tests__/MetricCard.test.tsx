import { render, screen } from '@testing-library/react';
import { MetricCard } from '../MetricCard';
import { PlayIcon } from '@heroicons/react/24/outline';

describe('MetricCard', () => {
  it('renders with basic props', () => {
    render(
      <MetricCard
        title="Total Views"
        value={1234}
      />
    );
    
    expect(screen.getByText('Total Views')).toBeInTheDocument();
    expect(screen.getByText('1K')).toBeInTheDocument();
  });

  it('formats large numbers correctly', () => {
    render(
      <MetricCard
        title="Views"
        value={1500000}
      />
    );
    
    expect(screen.getByText('1.5M')).toBeInTheDocument();
  });

  it('formats thousands correctly', () => {
    render(
      <MetricCard
        title="Views"
        value={5000}
      />
    );
    
    expect(screen.getByText('5K')).toBeInTheDocument();
  });

  it('formats numbers below 1000 with locale string', () => {
    render(
      <MetricCard
        title="Small Number"
        value={567}
      />
    );
    
    expect(screen.getByText('567')).toBeInTheDocument();
  });

  it('displays prefix and suffix', () => {
    render(
      <MetricCard
        title="Revenue"
        value={100}
        prefix="$"
        suffix="/month"
      />
    );
    
    expect(screen.getByText('$100/month')).toBeInTheDocument();
  });

  it('shows increase change correctly', () => {
    render(
      <MetricCard
        title="Views"
        value={1000}
        change={12.5}
        changeType="increase"
      />
    );
    
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    const changeContainer = screen.getByText('12.5%').closest('div');
    expect(changeContainer).toHaveClass('bg-green-50', 'text-green-700');
  });

  it('shows decrease change correctly', () => {
    render(
      <MetricCard
        title="Views"
        value={1000}
        change={8.3}
        changeType="decrease"
      />
    );
    
    expect(screen.getByText('8.3%')).toBeInTheDocument();
    const changeContainer = screen.getByText('8.3%').closest('div');
    expect(changeContainer).toHaveClass('bg-red-50', 'text-red-700');
  });

  it('renders with icon', () => {
    render(
      <MetricCard
        title="Videos"
        value={42}
        icon={PlayIcon}
      />
    );
    
    // Check if icon container is present
    const iconContainer = document.querySelector('.bg-blue-50');
    expect(iconContainer).toBeInTheDocument();
  });

  it('handles string values', () => {
    render(
      <MetricCard
        title="Status"
        value="Active"
      />
    );
    
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricCard
        title="Test"
        value={100}
        className="custom-class"
      />
    );
    
    // Check if custom class is applied to the root element
    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 