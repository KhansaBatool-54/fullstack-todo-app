import "./Logo.css";

function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 12l2 2 4-4"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <span className="logo-text">TaskFlow</span>
    </div>
  );
}

export default Logo;