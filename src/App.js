import HomePage from './pages/Home';
import RoomPage from './pages/Room';
import './App.css';
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/room/:roomId' element={<RoomPage />} />
    </Routes>
  );
}

export default App;
