import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import University   from './components/University/University';
import Bugadune     from './components/Bugadune/Bugadune';
import CSSCrypta    from './components/CSSCrypta/CSSCrypta';
import Forumia      from './components/Forumia/Forumia';
import Playground   from './components/Playground/Playground';
import TowerOfAPIon from './components/TowerOfAPIon/TowerOfAPIon';
//Pages
import LandingPage from './components/LandingPage/LandingPage'
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
// styling Files
import './index.css'




function App() {
  return (
    <Routes>
      <nav style={{ padding: 10, background: '#eee' }}>
        {['university','bugadune','csscrypta','forumia','playground','towerofapion']
          .map(path => (
            <Link key={path}
                  to={`/${path}`}
                  style={{ margin: '0 8px' }}
            >{path}</Link>
          ))}
      </nav>
     
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/university"   element={<University   />} />
        <Route path="/bugadune"     element={<Bugadune     />} />
        <Route path="/csscrypta"    element={<CSSCrypta    />} />
        <Route path="/forumia"      element={<Forumia      />} />
        <Route path="/playground"   element={<Playground   />} />
        <Route path="/towerofapion" element={<TowerOfAPIon />} />
        <Route path="*"             element={<University   />} />
      </Routes>
  );
}

export default App;
