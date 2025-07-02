import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Manejar solicitud PUT
  if (req.method === 'PUT') {
    try {
      const { id, title, description, image, dueDate, tags, columnId } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'El id de la tarea es requerido' });
      }

      const dataToUpdate: any = {};
      if (title !== undefined) dataToUpdate.title = title;
      if (description !== undefined) dataToUpdate.description = description;
      if (image !== undefined) dataToUpdate.image = image;
      if (dueDate !== undefined) dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
      if (tags !== undefined) dataToUpdate.tags = tags;
      if (columnId !== undefined) dataToUpdate.columnId = columnId;

      const updatedTask = await prisma.task.update({
        where: { id },
        data: dataToUpdate
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
