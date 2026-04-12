const Navbar = () => {
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="/">
          Dev Tinder
        </a>
      </div>
      <div className="dropdown dropdown-end">
        <button className="avatar padding-0">
          <div className="w-10 h-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </button>
        <ul
          tabIndex={-1}
          className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a className="justify-between" href="/profile">
              Profile <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
          <li>
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
