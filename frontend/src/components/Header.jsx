import { useNavigate } from "react-router-dom";

const Header = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/"); // Redirect to the login page
  };

  return (
    <div className="w-full py-4 px-10 text-white text-start bg-yellow-500 flex items-center justify-between">
      <h1 className="font-serif  text-2xl">Task Manager</h1>
      {token && (
        <button
          className="px-4 py-2 border border-white rounded-3xl active:bg-white active:text-yellow-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
