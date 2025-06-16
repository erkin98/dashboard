import { render } from '@testing-library/react';
import { MetricCard } from '../MetricCard';
import { PlayIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

describe('MetricCard Snapshot Tests', () => {
  it('should match snapshot for basic metric card', () => {
    const { container } = render(
      <MetricCard
        title="Total Views"
        value={125000}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with prefix and suffix', () => {
    const { container } = render(
      <MetricCard
        title="Monthly Revenue"
        value={4850}
        prefix="$"
        suffix="/month"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with positive change', () => {
    const { container } = render(
      <MetricCard
        title="Conversion Rate"
        value={3.2}
        suffix="%"
        change={12.5}
        changeType="increase"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with negative change', () => {
    const { container } = render(
      <MetricCard
        title="Bounce Rate"
        value={45.2}
        suffix="%"
        change={8.3}
        changeType="decrease"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with icon', () => {
    const { container } = render(
      <MetricCard
        title="Active Videos"
        value={24}
        icon={PlayIcon}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with icon and change', () => {
    const { container } = render(
      <MetricCard
        title="Views This Month"
        value={89000}
        icon={TrendingUpIcon}
        change={15.7}
        changeType="increase"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for large numbers', () => {
    const { container } = render(
      <MetricCard
        title="Total Impressions"
        value={2500000}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for string value', () => {
    const { container } = render(
      <MetricCard
        title="Account Status"
        value="Active"
        icon={TrendingUpIcon}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom className', () => {
    const { container } = render(
      <MetricCard
        title="Custom Styled"
        value={12345}
        className="border-2 border-cyan-500"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for complete example', () => {
    const { container } = render(
      <MetricCard
        title="Monthly Earnings"
        value={15420}
        prefix="$"
        suffix=" USD"
        change={18.2}
        changeType="increase"
        icon={TrendingUpIcon}
        className="border-2 border-cyan-500"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}); 