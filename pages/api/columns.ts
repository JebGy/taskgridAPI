import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Manejar solicitud GET
  if (req.method === 'GET') {
    try {
      const columns = await prisma.column.findMany({
        include: { tasks: true }
      });
      return res.status(200).json(columns);
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
