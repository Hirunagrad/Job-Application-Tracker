import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#007BFF",
      padding: "5px 20px",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
    },
    logo: {
      fontSize: "18px",
      fontWeight: "bold",
    },
    navLinks: {
      display: "flex",
      gap: "15px",
    },
    link: {
      color: "#fff",
      textDecoration: "none",
      fontWeight: "500",
      cursor: "pointer",
      fontSize: "12px",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Job Portal</div>
      <div style={styles.navLinks}>
        <Link to="/create-job" style={styles.link}>
          Create Job Post
        </Link>
        <Link to="/job-posts" style={styles.link}>
          Job Posts List
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
