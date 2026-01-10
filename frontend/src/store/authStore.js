import { create } from "zustand";
import {jwtDecode} from "jwt-decode";

const token = localStorage.getItem("token");
const user = token ? jwtDecode(token) : null;

const useAuthStore = create((set) => ({
  token,
  user,

  login: (token) => {
    localStorage.setItem("token", token);
    set({ token, user: jwtDecode(token) });
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, user: null });
  }
}));

export default useAuthStore;
