import Navbar from "../Navbar";

export default function NavbarExample() {
  return (
    <Navbar
      userEmail="user@example.com"
      onLogout={() => console.log("Logout clicked")}
    />
  );
}
