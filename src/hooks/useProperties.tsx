// hooks/useProperties.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Property } from "../Types/types";
import { API_BASE_URL } from "../core/api";

const fetchProperties = async (): Promise<Property[]> => {
  const res = await axios.get(`http:/192.168.1.8:3001/properties`);
  console.log(res);
  return res.data;
};

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });
};
