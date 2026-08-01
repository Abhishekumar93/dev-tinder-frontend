import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Body from './Body';
import { ProtectedRoute, PublicRoute } from './Routes';
import { lazy, Suspense } from 'react';
import Loader from './Components/Atoms/Loader';

const Login = lazy(() => import('./Components/Login'));
const Signup = lazy(() => import('./Components/Signup'));
const Profile = lazy(() => import('./Components/Profile'));
const Feed = lazy(() => import('./Components/Feed'));
const Connections = lazy(() => import('./Components/Connections'));

function App() {
  return (
    <BrowserRouter basename="/">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/" element={<h1>Hello World</h1>} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
