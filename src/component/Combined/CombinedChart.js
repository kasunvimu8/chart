import { createChart } from 'lightweight-charts';
import {default as HistoryChartDataProvider} from '../../utils/data/HistoryDataProvider';
import {default as LiveChartDataProvider} from '../../utils/data/LiveDataProvider';

const drawCombinedChart = () => {
    const chartType = 'area';
    const symbolInt = 738561;
    const symbolStr = "738561"

    let chartElement = document.createElement('div');

    const chart = createChart(chartElement, {
        width: 1600,
        height: 800, 
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
            // tickMarkFormatter: (time) => {
			// 	const d = new Date(time*1000);
			// 	return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
			// },
        }, 
    });

    let areaSeries = chart.addAreaSeries({
        topColor: 'rgba(33, 150, 243, 0.56)',
        bottomColor: 'rgba(33, 150, 243, 0.04)',
        lineColor: 'rgba(33, 150, 243, 1)',
        lineWidth: 2,
    });
    
    let darkTheme = {
        chart: {
            layout: {
                backgroundColor: '#2B2B43',
                lineColor: '#2B2B43',
                textColor: '#D9D9D9',
            },
            watermark: {
                color: 'rgba(0, 0, 0, 0)',
            },
            crosshair: {
                color: '#758696',
            },
            grid: {
                vertLines: {
                    color: 'rgba(70, 130, 180, 0.5)',
                    style: 1,
                    visible: true,
                },
                horzLines: {
                    color: 'rgba(70, 130, 180, 0.5)',
                    style: 1,
                    visible: true,
                },
            },
        },
        series: {
                topColor: 'rgba(32, 226, 47, 0.56)',
                bottomColor: 'rgba(32, 226, 47, 0.04)',
                lineColor: 'rgba(32, 226, 47, 1)',
        },
    };

    chart.applyOptions(darkTheme.chart);
    areaSeries.applyOptions(darkTheme.series);

    const chartHistoryDataReceivedCallback = (data) => {
        areaSeries.setData(data);
    }

    const chartLiveDataReceivedCallback = (data) => {
        areaSeries.update(data);
    }

    HistoryChartDataProvider(chartType, symbolInt, chartHistoryDataReceivedCallback);
    LiveChartDataProvider(chartType, symbolStr, chartLiveDataReceivedCallback);
    
    document.body.appendChild(chartElement);

}

export default drawCombinedChart;