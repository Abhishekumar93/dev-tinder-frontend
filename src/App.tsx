import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Body from './Body';
import { Login } from './Components';
import { ProtectedRoute, PublicRoute } from './Routes';

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<h1>Profile</h1>} />
            <Route path="/settings" element={<h1>Settings</h1>} />
            <Route path="/" element={<h1>Hello World</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
