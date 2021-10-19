import React, {useEffect} from 'react';
import drawHistoryChart from './component/History/HistoryChart';
import drawLiveChart from './component/Live/LiveChart';
import drawCombinedChart from './component/Combined/CombinedChart';

function App() {
  useEffect(()=> {
    // drawHistoryChart();
    // drawLiveChart();
    drawCombinedChart();
  },[])
  
  return (
    <div className="App">
    </div>
  );
}

export default App;
