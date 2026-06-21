import "./beuti.css";
import Signout from "./Signout.jsx";

function App() {
  return (
    <div className="container">
      <div className="card">

        <div className="left">
          <div className="logo"></div>

          <h1>Welcome!</h1>

          <div className="line"></div>

          <p>
            We provide professional event management services for weddings,
            parties, corporate events, and special occasions. Our goal is to
            make every event unique, well-organized, and memorable by handling
            all aspects of planning and execution with care and creativity.
          </p>

          <button className="learn-btn">Learn More</button>

          {/* Sign Out Button */}
          <Signout />

        </div>


        <div className="right">
          <div className="login-box">

            <h2>Full Name</h2>

            <label>User Name</label>
            <input type="text" placeholder="prajwal" />

            <label>Password</label>
            <input type="password" placeholder="prajdep" />


            <p className="forgot-password">
              <a href="#">Forgot Password?</a>
            </p>


            <button className="submit-btn">
              Submit
            </button>


            <div className="socials">
              <span>f</span>
              <span>📷</span>
              <span>p</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;