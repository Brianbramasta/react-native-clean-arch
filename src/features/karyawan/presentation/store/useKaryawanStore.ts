import React from "react";
import { Karyawan } from "../../domain/entities/Karyawan";

interface KaryawanState {
  karyawanList: Karyawan[];
  setKaryawanList: (list: Karyawan[]) => void;
  clear: () => void;
}

export const useKaryawanStore = (): KaryawanState => {
  const [karyawanList, setKaryawanListState] = React.useState<Karyawan[]>([]);

  const setKaryawanList = (list: Karyawan[]) => {
    setKaryawanListState(list);
  };

  const clear = () => {
    setKaryawanListState([]);
  };

  return { karyawanList, setKaryawanList, clear };
};