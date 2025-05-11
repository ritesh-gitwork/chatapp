import './App.css';
import { Routes,Route } from 'react-router-dom'
import Hompage from './Pages/Hompage';
import Chatpage from './Pages/Chatpage';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Hompage />} />
          <Route path='/chats' element={<Chatpage />} />
        </Routes>
    </div>
  );
}

export default App;
