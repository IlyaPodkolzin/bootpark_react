const AdminOnly = ({ children }) => {

  const roles = localStorage.getItem('roles')

  if (roles.includes("ADMIN")) {
    return children;  
  }
};

export default AdminOnly;
