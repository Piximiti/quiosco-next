import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import AdminLayout from "@/layout/AdminLayout";
import Orden from "@/components/Orden";
import { formatearDinero } from "@/helpers";

export default function Admin() {
  const [estado, setEstado] = useState("");
  const [totalGanancias, setTotalGanancias] = useState(0);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState("");
  const [filtrar, setFiltrar] = useState("");
  const fetcher = () =>
    axios(`/api/ordenes`).then(
      (datos) => datos.data
    );

  const { data, error, isLoading } = useSWR("/api/ordenes", fetcher, {
    refreshInterval: 1000,
  });

  const filtrarOrdenes = useCallback(
    (filtrarPor) => {
      if (filtrarPor === "") {
        return data;
      }
      return data.filter((orden) => `${orden.estado}` === filtrarPor);
    },
    [data]
  );

  const obtenerGananciasTotales = useCallback(() => {
    const ordenesCompletadas = filtrarOrdenes("true");
    const gananciasTotales = ordenesCompletadas.reduce(
      (total, orden) => orden.total + total,
      0
    );

    setTotalGanancias(gananciasTotales);
  }, [filtrarOrdenes]);

  useEffect(() => {
    if (data) {
      setOrdenesFiltradas(filtrarOrdenes(filtrar));
      obtenerGananciasTotales();
    }
  }, [data, obtenerGananciasTotales, filtrar, filtrarOrdenes]);

  return (
    <AdminLayout pagina={"Admin"}>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">Panel de Administración</h1>

        <select
          className="py-2 px-5 border rounded-lg focus:outline-none"
          onChange={(e) => setFiltrar(e.target.value)}
        >
          <option value="">Todas las ordenes</option>
          <option value={true}>Completadas</option>
          <option value={false}>Pendientes</option>
        </select>
      </div>
      <p className="text-2xl my-10">Administra las ordenes</p>

      <div className="flex mb-10">
        <div className="flex shadow-sm bg-gray-50 py-2 px-5 rounded-lg gap-5 items-center">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-300 rounded-lg p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#fff"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-black text-gray-800 uppercase">
              Ganancias Totales
            </p>
            <p className="text-xl font-black text-amber-500">
              {formatearDinero(totalGanancias)}
            </p>
          </div>
        </div>
      </div>

      {ordenesFiltradas && ordenesFiltradas.length > 0 ? (
        ordenesFiltradas.map((orden) => <Orden orden={orden} key={orden.id} />)
      ) : (
        <p>No hay ordenes para mostrar</p>
      )}
    </AdminLayout>
  );
}
