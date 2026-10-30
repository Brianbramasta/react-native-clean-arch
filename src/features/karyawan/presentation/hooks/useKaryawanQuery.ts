import { useQuery } from "@tanstack/react-query";
import { getKaryawanUseCase } from "../../di/container";

export const useKaryawanQuery = () => {
  return useQuery({
    queryKey: ["karyawan-list"],
    queryFn: () => getKaryawanUseCase.execute(),
  });
};