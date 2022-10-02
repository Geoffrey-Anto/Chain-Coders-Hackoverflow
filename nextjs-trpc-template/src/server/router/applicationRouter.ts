import { z } from "zod";
import { createRouter } from "./context";
import * as jwt from "jsonwebtoken";

export const applicationRouter = createRouter()
  .mutation("add_application", {
    input: z.object({
      bankId: z.string(),
    }),
    resolve: async ({ ctx, input: { bankId } }) => {
      const cookies = ctx.req.cookies;
      if (!cookies) {
        throw new Error("No cookie");
      }

      const user_token = cookies["user_token"];

      if (!user_token) {
        throw new Error("No user token");
      }

      const payload = jwt.decode(user_token) as any;

      if (!payload) {
        throw new Error("No payload");
      }

      const userId = payload.id;

      const isAlreadyAvailable = await ctx.prisma.applications.findFirst({
        where: {
          bankId,
          userId,
        },
      });

      if (isAlreadyAvailable) {
        throw new Error("Already Registered");
      }

      const application = await ctx.prisma.applications.create({
        data: {
          bankId: bankId,
          userId: userId,
          status: "PENDING",
        },
      });

      return application;
    },
  })
  .query("get_applications", {
    resolve: async ({ ctx }) => {
      const cookies = ctx.req.cookies;

      if (!cookies) {
        throw new Error("No cookie");
      }

      const bank_token = cookies["bank_token"];

      if (!bank_token) {
        throw new Error("No bank token");
      }

      const payload = jwt.decode(bank_token) as any;

      if (!payload) {
        throw new Error("No payload");
      }

      const id = payload.id;

      console.log(id);

      const applications = await ctx.prisma.applications.findMany({
        where: {
          bankId: id,
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          User: {
            name: "asc",
          },
        },
      });

      return applications;
    },
  })
  .mutation("change_status", {
    input: z.object({
      status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
      bankId: z.string(),
      userId: z.string(),
    }),
    resolve: async ({ ctx, input: { bankId, status, userId } }) => {
      const application = await ctx.prisma.applications.updateMany({
        data: {
          status: status,
        },
        where: {
          bankId,
          userId,
        },
      });

      return application;
    },
  });
