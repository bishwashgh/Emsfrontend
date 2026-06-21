function Signout() {

  const handleSignout = () => {
    localStorage.removeItem("user");

    alert("Signed out successfully");
  };

  return (
    <button onClick={handleSignout}>
      Sign Out
    </button>
  );
}

export default Signout;