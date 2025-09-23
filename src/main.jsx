import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CssBattle1 from './pages/css_battle_1'
import CssBattle2 from './pages/css_battle_2'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/css_battle_1" element={<CssBattle1 />} />
      <Route path="/css_battle_2" element={<CssBattle2 />} />
    </Routes>
  </BrowserRouter>
)
