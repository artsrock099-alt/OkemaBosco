import { writeFile, unlink, mkdir, access } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { randomUUID } from 'crypto';
import type { MediaType } from '@prisma/client';

const UPLOAD_DIR = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads');
const PUBLIC_URL_PREFIX = process.env.PUBLIC_URL_PREFIX || '/uploads';

export type StoredFile = {
  filename: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
};

function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  return 'DOCUMENT';
}

function sanitizeFilename(name: string): string {
  const ext = extname(name);
  const base = basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${base || 'file'}${ext}`;
}

async function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

export async function storeFile(
  file: Buffer | ArrayBuffer | string,
  originalName: string,
  mimeType: string,
  subfolder = ''
): Promise<StoredFile> {
  const buffer = typeof file === 'string' ? Buffer.from(file, 'base64') : Buffer.from(new Uint8Array(file as ArrayBuffer));
  const size = buffer.length;

  const date = new Date();
  const dateFolder = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  const folderPath = join(UPLOAD_DIR, subfolder, dateFolder);
  await ensureDir(folderPath);

  const uuid = randomUUID().slice(0, 8);
  const safeName = sanitizeFilename(originalName);
  const filename = `${uuid}-${safeName}`;
  const filePath = join(folderPath, filename);

  await writeFile(filePath, buffer);

  const url = `${PUBLIC_URL_PREFIX}/${subfolder ? `${subfolder}/` : ''}${dateFolder}/${filename}`.replace(/\/+/g, '/');

  return {
    filename,
    url,
    path: filePath,
    size,
    mimeType,
  };
}

export async function deleteFile(urlOrPath: string) {
  try {
    let filePath = urlOrPath;
    if (urlOrPath.startsWith(PUBLIC_URL_PREFIX)) {
      filePath = join(UPLOAD_DIR, urlOrPath.slice(PUBLIC_URL_PREFIX.length));
    }
    await access(filePath);
    await unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getImageDimensions(buffer: Buffer): { width?: number; height?: number } {
  try {
    if (buffer.length < 24) return {};
    const hex = buffer.toString('hex', 0, 24);
    if (hex.startsWith('ffd8')) {
      let offset = 2;
      while (offset < buffer.length - 9) {
        const marker = buffer[offset];
        if (marker !== 0xff) break;
        const type = buffer[offset + 1];
        if ((type >= 0xc0 && type <= 0xc3) || (type >= 0xc5 && type <= 0xc7) || (type >= 0xc9 && type <= 0xcb) || (type >= 0xcd && type <= 0xcf)) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    } else if (hex.startsWith('89504e47')) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    } else if (hex.startsWith('474946')) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height };
    } else if (hex.startsWith('424d')) {
      const width = buffer.readInt32LE(18);
      const height = buffer.readInt32LE(22);
      return { width: Math.abs(width), height: Math.abs(height) };
    }
  } catch {}
  return {};
}

export { getMediaType };
