"use client";

import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Users, University, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const commonChartOptions = (chartTitle: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: chartTitle,
      font: { size: 16 }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.2)' // Light grid lines
      },
      ticks: {
        color: '#666' // Tick color
      }
    },
    x: {
      grid: {
        display: false // No vertical grid lines
      },
      ticks: {
        color: '#666'
      }
    }
  },
});

// Helper to generate random data for charts
const generateRandomData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [userSignupsData, setUserSignupsData] = useState<any>(null);
  const [collegeDistributionData, setCollegeDistributionData] = useState<any>(null);
  const [recommendationActivityData, setRecommendationActivityData] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching data based on timeRange
    const labels = timeRange === 'last_7_days' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                   timeRange === 'last_30_days' ? Array.from({length: 30}, (_, i) => `Day ${i+1}`) :
                   Array.from({length: 12}, (_, i) => `Month ${i+1}`);
    
    setUserSignupsData({
      labels,
      datasets: [
        {
          label: 'New User Signups',
          data: generateRandomData(labels.length, 5, 50),
          borderColor: 'hsl(var(--primary))',
          backgroundColor: 'hsla(var(--primary), 0.5)',
          fill: true,
          tension: 0.3,
        },
      ],
    });

    setCollegeDistributionData({
      labels: ['USA', 'India', 'Canada', 'UK', 'Australia', 'Other'],
      datasets: [
        {
          label: 'Colleges by Country',
          data: generateRandomData(6, 10, 100),
          backgroundColor: [
            'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 
            'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--muted))'
          ],
          borderColor: 'hsl(var(--border))',
          borderWidth: 1,
        },
      ],
    });

    setRecommendationActivityData({
      labels,
      datasets: [
        {
          label: 'AI Recommendations Generated',
          data: generateRandomData(labels.length, 20, 200),
          backgroundColor: 'hsl(var(--accent))',
          borderColor: 'hsl(var(--accent))',
        },
      ],
    });

  }, [timeRange]);

  const summaryStats = [
    { title: "Total Users", value: "1,234", icon: <Users className="h-6 w-6 text-primary" />, trend: "+5% last month" },
    { title: "Total Colleges", value: "567", icon: <University className="h-6 w-6 text-primary" />, trend: "+10 new" },
    { title: "AI Recommendations", value: "8,910", icon: <TrendingUp className="h-6 w-6 text-primary" />, trend: "+12% today" },
  ];

  if (!userSignupsData || !collegeDistributionData || !recommendationActivityData) {
    return <div className="flex items-center justify-center h-full"><p>Loading analytics data...</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-primary" /> Platform Analytics
          </h1>
          <p className="text-muted-foreground">Overview of user activity and platform metrics.</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            <SelectItem value="last_12_months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {summaryStats.map(stat => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User Signups Over Time</CardTitle>
            <CardDescription>Tracks new user registrations.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-4">
            <Line options={commonChartOptions('User Signups')} data={userSignupsData} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>College Distribution by Country</CardTitle>
            <CardDescription>Shows the number of colleges per country.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-4 flex justify-center items-center">
             <div className="w-full max-w-[300px] h-full"> {/* Constrain Pie chart size */}
                <Pie options={{ ...commonChartOptions('Colleges by Country'), maintainAspectRatio: false }} data={collegeDistributionData} />
             </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI Recommendation Activity</CardTitle>
          <CardDescription>Number of AI recommendations generated daily/monthly.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] p-4">
          <Bar options={commonChartOptions('AI Recommendations Generated')} data={recommendationActivityData} />
        </CardContent>
      </Card>
    </div>
  );
}
