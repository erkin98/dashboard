import type { Meta, StoryObj } from '@storybook/react';
import { AIInsights } from './AIInsights';
import type { AIInsight } from '@/types';

const meta: Meta<typeof AIInsights> = {
  title: 'Components/AIInsights',
  component: AIInsights,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'AI-powered insights component that displays various types of coaching analytics insights.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    insights: {
      control: false,
      description: 'Array of AI insights to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIInsights>;

// Sample insights data
const sampleInsights: AIInsight[] = [
  {
    type: 'trend',
    title: 'Growing Engagement',
    description: 'Your videos are getting 25% more engagement this month compared to last month. This indicates your content is resonating better with your audience.',
    impact: 'high',
    action: 'Consider posting more frequently to capitalize on this trend.',
  },
  {
    type: 'recommendation',
    title: 'Optimize Upload Time',
    description: 'Your audience is most active between 2-4 PM EST. Consider scheduling uploads during this window to maximize initial views.',
    impact: 'medium',
    action: 'Schedule your next 3 videos for 3 PM EST to maximize initial views.',
  },
  {
    type: 'alert',
    title: 'Conversion Rate Drop',
    description: 'Your video-to-call conversion rate has dropped by 15% this week. This may indicate a mismatch between content and call-to-action.',
    impact: 'high',
    action: 'Review recent video CTAs and consider A/B testing different approaches.',
  },
];

const highImpactInsights: AIInsight[] = [
  {
    type: 'alert',
    title: 'Revenue Opportunity',
    description: 'High-performing videos could generate 40% more revenue with better conversion optimization.',
    impact: 'high',
    action: 'Implement advanced conversion tracking and optimization strategies.',
  },
  {
    type: 'trend',
    title: 'Viral Content Pattern',
    description: 'Videos posted on Tuesday mornings are 3x more likely to go viral based on your channel data.',
    impact: 'high',
  },
];

const mixedImpactInsights: AIInsight[] = [
  {
    type: 'recommendation',
    title: 'SEO Improvement',
    description: 'Optimizing video titles with target keywords could increase discoverability by 20%.',
    impact: 'low',
    action: 'Update titles for your top 10 performing videos with relevant keywords.',
  },
  {
    type: 'trend',
    title: 'Audience Growth',
    description: 'Your subscriber growth rate has increased by 12% this quarter.',
    impact: 'medium',
  },
  {
    type: 'alert',
    title: 'Technical Issue',
    description: 'Some videos are experiencing higher than normal buffering rates.',
    impact: 'high',
    action: 'Check video encoding settings and consider different quality presets.',
  },
];

// Default with sample insights
export const Default: Story = {
  args: {
    insights: sampleInsights,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    insights: [],
  },
};

// High impact only
export const HighImpactOnly: Story = {
  args: {
    insights: highImpactInsights,
  },
};

// Mixed impact levels
export const MixedImpactLevels: Story = {
  args: {
    insights: mixedImpactInsights,
  },
};

// Single insight
export const SingleInsight: Story = {
  args: {
    insights: [
      {
        type: 'recommendation',
        title: 'Content Strategy Tip',
        description: 'Your audience prefers educational content over promotional videos by a 4:1 ratio.',
        impact: 'medium',
        action: 'Focus on creating more educational content that provides value to your coaching audience.',
      },
    ],
  },
};

// Insights without actions
export const WithoutActions: Story = {
  args: {
    insights: [
      {
        type: 'trend',
        title: 'Seasonal Pattern',
        description: 'Your coaching videos perform 30% better during January and September.',
        impact: 'medium',
      },
      {
        type: 'alert',
        title: 'Platform Update',
        description: 'YouTube has updated their algorithm to favor longer-form content.',
        impact: 'low',
      },
    ],
  },
};

// All insight types
export const AllInsightTypes: Story = {
  args: {
    insights: [
      {
        type: 'trend',
        title: 'Positive Trend',
        description: 'Engagement rates are trending upward.',
        impact: 'high',
        action: 'Continue current content strategy.',
      },
      {
        type: 'recommendation',
        title: 'Strategy Recommendation',
        description: 'Consider diversifying content topics.',
        impact: 'medium',
        action: 'Plan content calendar with varied topics.',
      },
      {
        type: 'alert',
        title: 'Performance Alert',
        description: 'Some metrics need attention.',
        impact: 'low',
        action: 'Monitor performance closely.',
      },
    ],
  },
};

// Long content test
export const LongContent: Story = {
  args: {
    insights: [
      {
        type: 'recommendation',
        title: 'Comprehensive Content Strategy Analysis',
        description: 'Based on extensive analysis of your content performance over the past 6 months, we have identified several key patterns that suggest your audience is most engaged with educational content that provides actionable insights for business growth. This type of content not only drives higher engagement rates but also leads to more qualified leads for your coaching services.',
        impact: 'high',
        action: 'We recommend developing a content series focused on specific business challenges that your target audience faces, with each video providing a complete solution or framework that viewers can immediately implement in their own businesses.',
      },
    ],
  },
};

// Dark theme showcase
export const DarkTheme: Story = {
  args: {
    insights: sampleInsights,
    className: 'bg-slate-800',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}; 