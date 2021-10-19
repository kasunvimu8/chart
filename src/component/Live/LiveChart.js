import { createChart } from 'lightweight-charts';
import ChartDataProvider from '../../utils/data/LiveDataProvider';

const useLiveChart = () => {
    const chartType = 'area';
    const symbol = "738561";

    let chartElement = document.createElement('div');

    const chart = createChart(chartElement, {
        width: 1600,
        height: 800, 
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
            // secondsVisible: true,
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

    let firstData = true;
    let firstPoint = {};
    
    const chartDataReceivedCallback = (data) => {
        // console.log()
        areaSeries.update(data);

        if (firstData) {
            firstPoint = data;
            firstData = false;
        }
        
        chart.timeScale().setVisibleRange({
            from:(new Date(firstPoint.time *1000)).getTime() / 1000,
            to: (new Date(data.time *1000)).getTime() / 1000,
        });
    }

    ChartDataProvider(chartType, symbol, chartDataReceivedCallback);

    document.body.appendChild(chartElement);

}

export default useLiveChart
