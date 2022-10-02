import { createRouter } from "./context";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import crypto from "crypto";

interface UserApiReturnType {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export const userRouter = createRouter()
  // GET ALL USERS
  .query("getAll", {
    input: z.object({
      limit: z.number().optional(),
    }),

    resolve: async ({ input, ctx }) => {
      const cookie = ctx.req.headers.cookie;
      if (!cookie) {
        throw new Error("No cookie");
      }
      if (!cookie.includes("token")) {
        throw new Error("No token");
      }
      const token = cookie.split("token=")[1];
      try {
        jwt.verify(token, process.env.JWT_SECRET as string);
      } catch (error) {
        throw new Error("Invalid token");
      }
      const users = (await ctx.prisma.user.findMany({
        take: input.limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })) as UserApiReturnType[];
      return users;
    },
  })
  // REGISTER MUTATION
  .mutation("register", {
    input: z.object({
      name: z
        .string()
        .min(6, { message: "Name must be more than 6 characters" })
        .max(12, { message: "Name must be less than 12 characters" }),
      email: z.string().email({ message: "Enter Valid Email" }),
      password: z.string(),
    }),

    resolve: async ({ input, ctx }): Promise<UserApiReturnType> => {
      const isUserExist = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (isUserExist) {
        throw new Error("User already exist");
      }

      const hashedPassword = await bcrypt.hash(
        input.password,
        parseInt(process.env.SALT_ROUNDS as string)
      );

      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
      });

      const priv = privateKey.export({ type: "pkcs1", format: "pem" });
      const pub = publicKey.export({ type: "pkcs1", format: "pem" });

      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          private_key: priv as string,
          public_key: pub as string,
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
    },
  })
  // LOGIN MUTATION
  .mutation("login", {
    input: z.object({
      email: z.string().email({ message: "Enter Valid Email" }),
      password: z.string(),
    }),
    resolve: async ({ input, ctx }): Promise<UserApiReturnType> => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
        include: {
          kyc: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordMatch = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!isPasswordMatch) {
        throw new Error("Password is incorrect");
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        }
      );

      if (user.kyc) {
        ctx.res.setHeader("Set-Cookie", [
          `kyc_token=verified; path=/; httpOnly; sameSite=strict`,
          `user_token=${token}; path=/; httpOnly; sameSite=strict`,
        ]);
      } else {
        ctx.res.setHeader(
          "Set-Cookie",
          `user_token=${token}; path=/; httpOnly; sameSite=strict`
        );
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
    },
  })
  // LOGOUT MUTATION
  .mutation("logout", {
    resolve: async ({ ctx }) => {
      ctx.res.setHeader("Set-Cookie", [
        `user_token=; path=/; httpOnly; sameSite=strict; Max-Age=0`,
        `kyc_token=; path=/; httpOnly; sameSite=strict; Max-Age=0`,
      ]);
      return true;
    },
  });
