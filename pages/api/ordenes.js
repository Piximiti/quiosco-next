import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const prisma = new PrismaClient();

    if(req.method === 'GET') {
        let ordenes;
        if(req.query.estado) {
            ordenes = await prisma.orden.findMany({
                where: {
                    estado: req.query.estado
                }
            });
        } else {
            ordenes = await prisma.orden.findMany();
        }

        res.status(200).json(ordenes)
    }

    if(req.method === 'POST') {
        const orden = await prisma.orden.create({
            data: {
                nombre: req.body.nombre,
                total: req.body.total,
                pedido: req.body.pedido,
                fecha: req.body.fecha
            }
        })

        res.status(200).json(orden)
    }
}