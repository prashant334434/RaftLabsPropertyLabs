import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../core/api";
import { Profile } from "../Types/types";

const fetchProfile = async (): Promise<Profile> => {
  const res = await axios.get(`${API_BASE_URL}/profile`);
  return res.data;
};

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
