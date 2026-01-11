import { create } from "zustand";
import {jwtDecode} from "jwt-decode";

const token = localStorage.getItem("token");
const user = token ? jwtDecode(token) : null;

const useAuthStore = create((set) => ({
  token,
  user,
  currentUserId: user?.userId || null,

  login: (token) => {
    const decodedUser = jwtDecode(token);
    localStorage.setItem("token", token);
    set({ token, user: decodedUser, currentUserId: decodedUser.userId });
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, user: null, currentUserId: null });
  }
}));

export default useAuthStore;
