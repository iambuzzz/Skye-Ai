export default function Footer() {
  return (
    <footer>
      <div style={{ width: "100%", padding: 20, minHeight: "70px", maxHeight: "80px", marginTop: 1, marginBottom:"20px" }}>
        <p className="footer-text">
          Built with Love By iambuzz 
          <img 
            src="logo.png" 
            className="footer-img"
            alt="robot logo"
          />
        </p>
      </div>
    </footer>
  );
}

