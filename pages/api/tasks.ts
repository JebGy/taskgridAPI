import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
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
        const { title, description, image, dueDate, tags, columnId } = req.body;
  
        if (!title || !columnId) {
          return res.status(400).json({ error: 'Title and columnId are required' });
        }
  
        const newTask = await prisma.task.create({
          data: {
            title,
            description: description || null,
            image: image || null,
            dueDate: dueDate ? new Date(dueDate) : null,
            tags: tags || [],
            columnId
          }
        });
  
        return res.status(201).json(newTask);
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