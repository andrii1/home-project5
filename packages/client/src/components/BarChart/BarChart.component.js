/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import './BarChart.styles.css';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d';

export const BarChart = () => {
  const barChartOptions = {
    chart: {
      renderTo: 'container',
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
    },
    xAxis: {
      categories: [
        'Mystery',
        'Science Fiction',
        'Romance',
        'Fantasy',
        'Biography',
      ],
    },
    yAxis: {
      title: {
        enabled: false,
      },
    },
    zAxis: {
      title: {
        text: 'Depth',
      },
    },
    title: {
      text: 'Book Sales by Genre',
      align: 'left',
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        depth: 25,
      },
    },
    series: [
      {
        data: [1318, 1073, 1060, 813, 775],
        colorByPoint: true,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
};

BarChart.propTypes = {};

BarChart.defaultProps = {};
