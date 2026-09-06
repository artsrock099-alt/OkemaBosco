import { prisma } from './db';
import type { Prisma } from '@prisma/client';

export async function createAuditLog(
  action: string,
  entity: string,
  entityId?: string,
  userId?: string,
  metadata?: Record<string, unknown>,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        metadata: (metadata ?? {}) as Prisma.InputJsonValue,
        ipAddress,
        userAgent,
      },
    });
  } catch (e) {
    console.error('Audit log error:', e);
  }
}
