import type { Meta, StoryObj } from '@storybook/react';
import { PlayIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';
import { MetricCard } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Components/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A metric card component for displaying key dashboard metrics with optional icons, changes, and formatting.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title/label for the metric',
    },
    value: {
      control: { type: 'text' },
      description: 'The metric value (number or string)',
    },
    prefix: {
      control: 'text',
      description: 'Prefix to display before the value (e.g., "$")',
    },
    suffix: {
      control: 'text',
      description: 'Suffix to display after the value (e.g., "/month")',
    },
    change: {
      control: { type: 'number', min: -100, max: 100, step: 0.1 },
      description: 'Percentage change to display',
    },
    changeType: {
      control: { type: 'select' },
      options: ['increase', 'decrease'],
      description: 'Type of change (affects color)',
    },
    icon: {
      control: false,
      description: 'Icon component to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

// Basic metric card
export const Default: Story = {
  args: {
    title: 'Total Views',
    value: 125000,
  },
};

// With prefix and suffix
export const WithPrefixSuffix: Story = {
  args: {
    title: 'Monthly Revenue',
    value: 4850,
    prefix: '$',
    suffix: '/month',
  },
};

// With positive change
export const WithPositiveChange: Story = {
  args: {
    title: 'Conversion Rate',
    value: 3.2,
    suffix: '%',
    change: 12.5,
    changeType: 'increase',
  },
};

// With negative change
export const WithNegativeChange: Story = {
  args: {
    title: 'Bounce Rate',
    value: 45.2,
    suffix: '%',
    change: 8.3,
    changeType: 'decrease',
  },
};

// With icon
export const WithIcon: Story = {
  args: {
    title: 'Active Videos',
    value: 24,
    icon: PlayIcon,
  },
};

// With icon and positive change
export const WithIconAndChange: Story = {
  args: {
    title: 'Views This Month',
    value: 89000,
    icon: TrendingUpIcon,
    change: 15.7,
    changeType: 'increase',
  },
};

// Large number formatting
export const LargeNumbers: Story = {
  args: {
    title: 'Total Impressions',
    value: 2500000,
  },
};

// String value
export const StringValue: Story = {
  args: {
    title: 'Account Status',
    value: 'Active',
    icon: TrendingUpIcon,
  },
};

// Small number
export const SmallNumber: Story = {
  args: {
    title: 'New Subscribers',
    value: 127,
    change: 23.4,
    changeType: 'increase',
  },
};

// Currency example
export const Currency: Story = {
  args: {
    title: 'Revenue Per View',
    value: 0.42,
    prefix: '$',
    change: 5.8,
    changeType: 'increase',
  },
};

// All props together
export const FullExample: Story = {
  args: {
    title: 'Monthly Earnings',
    value: 15420,
    prefix: '$',
    suffix: ' USD',
    change: 18.2,
    changeType: 'increase',
    icon: TrendingUpIcon,
    className: 'border-2 border-cyan-500',
  },
}; 