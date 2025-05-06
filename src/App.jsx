import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import University   from './components/University/University';
import Bugadune     from './components/Bugadune/Bugadune';
import CSSCrypta    from './components/CSSCrypta/CSSCrypta';
import Forumia      from './components/Forumia/Forumia';
import Playground   from './components/Playground/Playground';
import TowerOfAPIon from './components/TowerOfAPIon/TowerOfAPIon';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10, background: '#eee' }}>
        {['university','bugadune','csscrypta','forumia','playground','towerofapion']
          .map(path => (
            <Link key={path}
                  to={`/${path}`}
                  style={{ margin: '0 8px' }}
            >{path}</Link>
          ))}
      </nav>
      <Routes>
        <Route path="/university"   element={<University   />} />
        <Route path="/bugadune"     element={<Bugadune     />} />
        <Route path="/csscrypta"    element={<CSSCrypta    />} />
        <Route path="/forumia"      element={<Forumia      />} />
        <Route path="/playground"   element={<Playground   />} />
        <Route path="/towerofapion" element={<TowerOfAPIon />} />
        <Route path="*"             element={<University   />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
