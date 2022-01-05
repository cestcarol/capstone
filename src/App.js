import './App.css';

import CustomNodeExample from './CustomNodeExample'
//import LayoutFlow from './LayoutFlow';


function App() {
  return (
    <div
      //className='diagram-container'
      style={{ height: 600 }}>
      <CustomNodeExample />
    </div>
    /*
    <div className='diagram-container' style={{ height: 500, }}>
      <LayoutFlow />
    </div>
    */
  )
}

export default App;
