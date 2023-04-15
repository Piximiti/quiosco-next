import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { formatearDinero } from "@/helpers";

export default function Orden({ orden }) {
  const { id, nombre, total, pedido, estado } = orden;
  const completarOrden = async () => {
    try {
      await axios.post(`/api/ordenes/${id}`);
      toast.success("Orden lista.");
    } catch (error) {
      toast.error("Hubo un error.");
    }
  };
  return (
    <div className="border p-10 space-y-5 mb-5">
      <h3 className="text-2xl font-bold">Orden: {id}</h3>
      <p className="text-lg font-bold">Cliente: {nombre}</p>

      <div>
        {pedido.map((platillo) => (
          <div
            key={platillo.id}
            className="py-3 flex border-b last-of-type:border-0 items-center"
          >
            <div className="w-32">
              <Image
                width={400}
                height={500}
                src={`/assets/img/${platillo.imagen}.jpg`}
                alt={`Imagen platillo ${platillo.nombre}`}
              />
            </div>

            <div className="p-5 space-y-2">
              <h4 className="text-xl font-bold text-amber-500">
                {platillo.nombre}
              </h4>
              <p className="text-lg font-bold">Cantidad: {platillo.cantidad}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="md:flex md:items-center md:justify-between my-10">
        <p className="mt-5 font-black text-4xl text-amber-500">
          {!estado ? "Total a pagar" : "Total"}: {formatearDinero(total)}
        </p>

        {!estado ? (
          <button
            className="bg-indigo-600 hover:bg-indigo-800 text-white mt-5 md:mt-0 py-3 px-10 font-bold uppercase rounded-lg"
            type="button"
            onClick={completarOrden}
          >
            Completar Orden
          </button>
        ) : (
          <div className="bg-gray-100 mt-5 md:mt-0 py-3 px-10 font-bold uppercase rounded-lg flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 fill-lime-400"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>

            <p className="text-lime-400 font-black">Completada</p>
          </div>
        )}
      </div>
    </div>
  );
}
