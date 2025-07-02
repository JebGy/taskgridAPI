import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

//NEXT_AWS_S3_REGION
//NEXT_AWS_S3_ACCESS_KEY_ID
//NEXT_AWS_S3_SECRET_ACCESS_KEY
//NEXT_AWS_S3_BUCKET_NAME

const region = process.env.NEXT_AWS_S3_REGION;
const accessKeyId = process.env.NEXT_AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("Faltan variables de entorno de AWS S3");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

import type { NextApiRequest, NextApiResponse } from "next";

const bucketName = process.env.NEXT_AWS_S3_BUCKET_NAME;

if (!bucketName) {
  throw new Error("Falta la variable de entorno NEXT_AWS_S3_BUCKET_NAME");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    // Esperar a que el archivo llegue en formato base64 o binario
    const { file, fileName, contentType } = req.body;

    if (!file || !fileName || !contentType) {
      return res.status(400).json({ error: "Faltan parámetros: file, fileName o contentType" });
    }

    // Decodificar el archivo de base64
    const buffer = Buffer.from(file, "base64");

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    };

    await s3Client.send(new PutObjectCommand(params));

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;

    return res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("Error al subir archivo a S3:", error);
    let mensaje = "Error interno del servidor";
    if (error instanceof Error) {
      mensaje = error.message;
    }
    return res.status(500).json({ error: mensaje });
  }
}

