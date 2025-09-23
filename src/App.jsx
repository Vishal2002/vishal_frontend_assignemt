import { Link } from 'react-router-dom';
import BirthdayCalendar from './components/BirthdayCalendar';

export default function App() {
  return (
    <div>
      <nav style={{ padding: '10px', backgroundColor: '#333', color: 'white' }}>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
          <li style={{ marginRight: '20px' }}><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Birthday Calendar</Link></li>
          <li style={{ marginRight: '20px' }}><Link to="/css_battle_1" style={{ color: 'white', textDecoration: 'none' }}>CSS Battle 1</Link></li>
          <li><Link to="/css_battle_2" style={{ color: 'white', textDecoration: 'none' }}>CSS Battle 2</Link></li>
        </ul>
      </nav>
      <BirthdayCalendar />
    </div>
  )
}