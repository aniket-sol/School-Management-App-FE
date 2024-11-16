const Navbar = () => {
    return (
      <nav className="flex justify-between items-center p-4 bg-transparent fixed w-full z-10">
        <div className="text-2xl font-bold text-white">School Management App</div>
        <div>
          <a 
            href="/" 
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-300 mr-2"
          >
            Login
          </a>
          <a 
            href="/signup" 
            className="ml-2 px-4 py-2 border border-white text-white rounded shadow hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Signup
          </a>
        </div>
      </nav>
    );
  };

export default Navbar;