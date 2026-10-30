"use server";

import prisma from "@/lib/prisma";

export type TenantRole = "TenantAdmin" | "Viewer";

export type TenantMembership = {
  tenant_id: number;
  tenant_name: string;
  role: TenantRole;
};

export async function getUserMemberships(userId: number) {
  try {
    const memberships = await prisma.tenant_memberships.findMany({
      where: {
        user_id: userId,
      },
      select: {
        tenant_id: true,
        role: true,
        tenant: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        tenant_id: "asc",
      },
    });

    return {
      success: true,
      data: memberships.map((membership) => ({
        tenant_id: membership.tenant_id,
        tenant_name: membership.tenant.name,
        role: membership.role,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch user memberships:", error);

    return {
      success: false,
      data: [],
      error: "Failed to fetch memberships",
    };
  }
}
