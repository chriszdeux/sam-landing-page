"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const labels = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40'];

export function PowerChart() {
  const data = {
    labels,
    datasets: [
      {
        label: 'Poder',
        data: [20, 20, 40, 40, 25, 30, 60, 65, 50],
        borderColor: '#00f3ff', // Cyan neon color
        backgroundColor: 'rgba(0, 243, 255, 0.05)', // Faint cyan fill
        borderWidth: 2,
        fill: true,
        tension: 0, // angular lines like the drawing
        pointRadius: 0, // hide points
      },
    ],
  };

  const options = {
    layout: { padding: 0 },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        enabled: true,
        backgroundColor: 'rgba(10, 15, 30, 0.95)',
        titleColor: '#00f3ff',
        borderColor: 'rgba(0, 243, 255, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.02)' },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(0, 243, 255, 0.5)', font: { size: 10 } },
        min: 0,
        max: 80,
      },
    },
  };

  return <Line options={options} data={data} />;
}

export function TemperatureChart() {
  const data = {
    labels,
    datasets: [
      {
        label: 'Temp Global',
        data: [50, 52, 51, 55, 58, 56, 59, 62, 60],
        borderColor: '#ff0055', // Neon Pink color
        backgroundColor: 'rgba(255, 0, 85, 0.05)',
        borderWidth: 2,
        fill: true,
        tension: 0.3, // smooth curves for temperature
        pointRadius: 0,
      },
    ],
  };

  const options = {
    layout: { padding: 0 },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        enabled: true,
        backgroundColor: 'rgba(10, 15, 30, 0.95)',
        titleColor: '#ff0055',
        borderColor: 'rgba(255, 0, 85, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: { 
        grid: { color: 'rgba(255, 255, 255, 0.02)' },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } },
      },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 0, 85, 0.5)', font: { size: 10 } },
        min: 0,
        max: 100,
      },
    },
  };

  return <Line options={options} data={data} />;
}

export function EnergyCostChart() {
  const data = {
    labels,
    datasets: [
      {
        label: 'Costo',
        data: [12, 11, 15, 14, 18, 17, 20, 19, 22],
        borderColor: '#00e676', // Neon Green color
        backgroundColor: 'rgba(0, 230, 118, 0.05)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    layout: { padding: 0 },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        enabled: true,
        backgroundColor: 'rgba(10, 15, 30, 0.95)',
        titleColor: '#00e676',
        borderColor: 'rgba(0, 230, 118, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: { 
        grid: { color: 'rgba(255, 255, 255, 0.02)' },
        ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } },
      },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(0, 230, 118, 0.5)', font: { size: 10 } },
        min: 0,
        max: 30,
      },
    },
  };

  return <Line options={options} data={data} />;
}
