import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Manejar solicitud DELETE
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'El id es requerido' });
      }

      const deletedTask = await prisma.task.delete({
        where: { id }
      });

      return res.status(200).json({ message: 'Tarea eliminada correctamente', deletedTask });
    } catch (error) {
      console.error('Error:', error);
      let mensaje = "Error interno del servidor";
      if (error instanceof Error) {
        mensaje = error.message;
      }
      return res.status(500).json({ error: mensaje });
    }
  }

  // Método no permitido
  return res.status(405).end(`Método ${req.method} no permitido`);
}
