const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://api.pg.gradezy.in/api"
    : "http://localhost:5001/api";

export default API_BASE;
