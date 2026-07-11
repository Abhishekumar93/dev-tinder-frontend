import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../Store';
import { logoutUser } from '../../Services/Api/auth';
import { useApiMutation } from '../../Hooks';

export const Navbar = () => {
  const navigate = useNavigate();
  const { executeMutation, isMutating } = useApiMutation();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logoutUser);

  const userLogout = async () => {
    const requestBody = logoutUser();
    const response = await executeMutation(requestBody);
    if (response?.status === 200) {
      logout();
    }
  };
  const handleProfileAuth = async () => {
    if (user) await userLogout();
    if (location.pathname !== '/login') navigate('/login', { replace: true });
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <a
          className="btn btn-ghost text-xl hover:bg-transparent hover:border-none hover:scale-105 transform transition duration-300"
          href="/"
        >
          <span className="text-teal-700 dark:text-teal-300">Dev Tinder</span>
        </a>
      </div>
      <div className="dropdown dropdown-end">
        <button className="avatar padding-0">
          <div className="w-10 h-10 rounded-full">
            <img
              alt={user ? `${user.firstName}_${user.lastName}` : 'Profile Pic'}
              src={
                user?.profilePic ||
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
              }
            />
          </div>
        </button>
        <ul
          tabIndex={-1}
          className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <button
              className={`bg-transparent border-none ${isMutating ? 'button-disabled' : ''}`}
              onClick={handleProfileAuth}
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
