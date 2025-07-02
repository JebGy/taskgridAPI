import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Manejar solicitud POST
  if (req.method === 'POST') {
    try {
      const { taskId, newColumnId } = req.body;

      if (!taskId || !newColumnId) {
        return res.status(400).json({ error: 'taskId y newColumnId son requeridos' });
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { columnId: newColumnId }
      });

      return res.status(200).json(updatedTask);
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
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
