/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import './BarChart.styles.css';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d';
import exporting from 'highcharts/modules/exporting';

export const BarChart = ({ dataSeries }) => {
  const chartOptions = {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 20,
        beta: 90,
        depth: dataSeries.length * 71,
        viewDistance: 5,
        frame: {
          bottom: {
            size: 1,
            color: 'rgba(0,0,0,0.05)',
          },
        },
      },
    },
    title: {
      text: 'GitHub contributions 3d graph',
    },

    yAxis: {
      min: 0,
      labels: {
        enabled: false, // Hides the Y-axis labels
      },
      title: {
        text: null, // Hides the Y-axis title (the "Values" text)
      },
    },
    xAxis: {
      min: 0,
      gridLineWidth: 1,
      labels: {
        enabled: false, // Hides the Y-axis labels
      },
      categories: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    },
    zAxis: {
      min: 0,
      // max: 3,
      // categories: [1, 2, 3, 4],
      // labels: {
      //   y: 5,
      //   rotation: 18,
      // },
    },
    tooltip: {
      pointFormatter() {
        const { date, y } = this; // Destructure point data
        return `Date: <b>${date}</b><br>Value: <b>${y}</b>`;
      },
    },
    plotOptions: {
      series: {
        groupZPadding: 10,
        depth: 60,
        groupPadding: 0,
        grouping: false,
      },
    },
    series: dataSeries,
    exporting: {
      enabled: true, // Enable exporting feature
      buttons: {
        contextButton: {
          menuItems: [
            'viewFullscreen', // Fullscreen option
            'printChart', // Print option
          ],
        },
      },
    },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

BarChart.propTypes = {
  dataSeries: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

BarChart.defaultProps = {};
