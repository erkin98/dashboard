# High-Ticket Coaching Dashboard

A comprehensive dashboard for tracking the complete sales funnel of a high-ticket coaching business, from YouTube views to revenue generation.

## 🎯 Project Overview

This dashboard provides complete visibility into the coaching business funnel:
**YouTube Videos → Website Landing Page → Call Booked → Call Tracked → Sale → Email Follow-ups**

Built for the Codebender AI Competition, this project demonstrates real-world business intelligence capabilities for high-ticket coaching programs.

## ✨ Key Features

### 📊 Core Analytics
- **Monthly Metrics Tracking**: All required metrics from YouTube views to revenue
- **Sales Funnel Visualization**: Interactive funnel showing conversion rates at each stage
- **Trend Analysis**: Month-over-month performance comparisons
- **Video Attribution**: Track which YouTube videos drive the most revenue

### 🤖 AI-Powered Insights
- **Automated Trend Detection**: AI identifies performance patterns
- **Smart Recommendations**: Actionable suggestions for improvement
- **Alert System**: Notifications for performance drops or opportunities

### 📈 Advanced Visualizations
- **Interactive Charts**: Built with Recharts for smooth user experience
- **Performance Leaderboards**: Video ranking by revenue generation
- **Conversion Rate Analysis**: Deep dive into each funnel stage
- **Geographic Insights**: Lead distribution by country

### 💼 Business Intelligence
- **Revenue Tracking**: Separate tracking for PIF vs. installments
- **Call Analytics**: Show-up rates, acceptance rates, close rates
- **ROI Metrics**: Revenue per view, cost per acquisition
- **Growth Metrics**: Month-over-month growth trends

## 🚀 Required Monthly Metrics (Competition Spec)

The dashboard tracks all required metrics per month:

```
✅ YouTube Total Views
✅ YouTube Unique Views  
✅ Unique Website Visitors
✅ Total Calls Booked
✅ Accepted Calls
✅ New Cash Collected:
   - From Paid in Full
   - From Installments
✅ Total Cash Collected (including recurring)
```

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Heroicons, Lucide React
- **Data**: Mock data with realistic business metrics
- **API Integration**: Ready for YouTube, Kajabi, Cal.com APIs

## 📂 Project Structure

```
coaching-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dashboard/         # Main data API
│   │   │   └── ai-insights/       # AI insights API
│   │   └── page.tsx              # Main dashboard page
│   ├── components/
│   │   ├── MetricCard.tsx        # Reusable metric display
│   │   ├── FunnelChart.tsx       # Sales funnel visualization
│   │   ├── TrendsChart.tsx       # Trend analysis charts
│   │   ├── VideoPerformanceTable.tsx  # Video leaderboard
│   │   └── AIInsights.tsx        # AI recommendations
│   ├── data/
│   │   └── mockData.ts           # Realistic demo data
│   └── types/
│       └── index.ts              # TypeScript definitions
```

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd coaching-dashboard
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Dashboard**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Dashboard Features

### 1. **Executive Summary**
- Key metrics with month-over-month changes
- Overall funnel conversion rates
- Revenue performance indicators

### 2. **Sales Funnel Overview**
- Visual funnel showing conversion at each stage
- Drop-off points identification
- Conversion rate optimization opportunities

### 3. **Trend Analysis**
- Revenue trends (new vs. total)
- YouTube performance over time
- Call booking and acceptance trends
- Conversion rate evolution

### 4. **Video Performance Intelligence**
- Revenue attribution per video
- Performance ratings (Excellent/Good/Average/Poor)
- Views-to-revenue conversion tracking
- Content optimization insights

### 5. **AI-Powered Insights**
- Automated trend detection
- Performance alerts
- Optimization recommendations
- Growth opportunity identification

## 🔌 API Integration Ready

The dashboard is architected for real API integration:

### YouTube API
```typescript
// Ready for real YouTube Analytics API
const youtubeMetrics = await youtube.analytics.reports.query({
  ids: 'channel==UCxxxxxx',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  metrics: 'views,estimatedMinutesWatched',
  dimensions: 'video'
});
```

### Kajabi API
```typescript
// Ready for Kajabi webhook integration
const kajabiData = await fetch('/api/kajabi/analytics', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

### Cal.com API
```typescript
// Ready for Cal.com booking data
const bookings = await fetch('/api/cal/bookings', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

## 🎨 Design Principles

- **Mobile-First**: Responsive design for all devices
- **Performance**: Optimized loading and rendering
- **Accessibility**: WCAG compliant components
- **User Experience**: Intuitive navigation and clear data presentation

## 📈 Business Value

This dashboard provides:

1. **Complete Funnel Visibility**: Track every step from view to sale
2. **Data-Driven Decisions**: Identify what content drives revenue
3. **Performance Optimization**: Spot bottlenecks and opportunities
4. **ROI Tracking**: Understand true cost per acquisition
5. **Scalability Insights**: Plan growth based on conversion data

## 🏆 Competition Features

### Required Features ✅
- [x] Monthly metrics tracking
- [x] Funnel visualization with conversion rates
- [x] YouTube video attribution
- [x] Trend analysis and comparisons
- [x] Revenue tracking (PIF vs. installments)

### Bonus Features ✅
- [x] AI-powered insights and recommendations
- [x] Video performance leaderboard
- [x] Geographic lead distribution
- [x] Advanced funnel drop-off analysis
- [x] Executive summary with key insights

## 🎬 Demo Features

The dashboard includes realistic mock data showing:
- 6 months of growth trends (15% monthly growth)
- 10 YouTube videos with varying performance
- Realistic conversion rates for coaching business
- AI insights based on data patterns
- Geographic distribution across major markets

## 📱 Mobile Experience

Fully responsive design optimized for:
- Desktop dashboards (primary use case)
- Tablet monitoring
- Mobile quick-checks

## 🔮 Future Enhancements

- Real-time data updates
- Custom date range filtering
- Export capabilities (PDF, CSV)
- Team collaboration features
- Advanced A/B testing integration
- Predictive analytics

## 📞 Contact & Support

Built for the Codebender AI Competition by [Your Name]
- **Demo**: [Live Dashboard URL]
- **Video**: [Loom Walkthrough URL]
- **Repository**: [GitHub URL]

---

*This dashboard demonstrates the power of data-driven coaching business optimization, providing clear insights from YouTube content to revenue generation.*
