import moment from 'moment';

const processDataForAreaChart = (symbolData) => {
    const requiredData = [];

    symbolData.t.forEach((time, index) => {
        requiredData.push({
            time: time,
            value: symbolData.c[index]
            });
    })

    return requiredData;
}


const ChartDataProvider = (chartType, symbol, chartDataReceivedCallback) => {

    fetch(`https://stock-api.fnotrader.com/v2/pattern?tokens=${symbol}&type=15m&to=2021-10-18T15:30&from=2021-10-01T09:15`)
    .then(res => res.json())
    .then(data => {
        const symbolData = data?.data[symbol];

        switch (chartType) {
            case 'area':
                const data = processDataForAreaChart(symbolData);
                chartDataReceivedCallback(data);
                return;
            default:
                return symbolData;
        }
    })
    .catch(err => console.log(err))
}

export default ChartDataProvider
