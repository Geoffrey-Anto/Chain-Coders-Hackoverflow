import { z } from "zod";
import { createRouter } from "./context";
import * as jwt from "jsonwebtoken";
import crypto from "crypto";
import { ocrSpace } from "ocr-space-api-wrapper";

const extract_aadhaar = (parsedText: string) => {
  const size = 12;

  for (let i = 0; i < parsedText.length - size; i++) {
    let sub = parsedText.substring(i, i + size);
    // can contain only numbers and spaces
    if (/^[0-9 ]+$/.test(sub)) {
      // remove spaces
      sub = sub.replace(/\s/g, "");
      // check if length is 12
      if (sub.length === 12) {
        return sub;
      }
    }
  }
  return null;
};

export const kycRouter = createRouter()
  .query("getForMe", {
    input: z.object({
      take: z.number().min(0, { message: "Enter Number Greater than 0" }),
    }),

    resolve: async ({ input: { take }, ctx }) => {
      const cookie = ctx.req.headers.cookie;
      if (!cookie) {
        throw new Error("No cookie");
      }
      if (!cookie.includes("user_token")) {
        throw new Error("No token");
      }
      const token = cookie.split("user_token=")[1];

      let payload: any = null;

      try {
        payload = jwt.verify(token, process.env.JWT_SECRET as string);
      } catch (error) {
        throw new Error("Invalid token");
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const { private_key } = user;

      const priv = Buffer.from(private_key);

      const kyc = await ctx.prisma.kYC.findUnique({
        where: {
          userId: payload.id,
        },
      });

      if (!kyc) {
        throw new Error("KYC not found");
      }

      let { aadharId, driversLicenseId, panId, passport } = kyc;

      // const aadhar = crypto
      //   .privateDecrypt(
      //     {
      //       key: priv,
      //       padding: crypto.constants.RSA_NO_PADDING,
      //     },
      //     Buffer.from(aadharId, "base64")
      //   )
      //   .toString("base64");
      // const driversLicense = crypto
      //   .privateDecrypt(
      //     {
      //       key: priv,
      //       padding: crypto.constants.RSA_NO_PADDING,
      //     },
      //     Buffer.from(driversLicenseId, "base64")
      //   )
      //   .toString("base64");
      // const pan = crypto
      //   .privateDecrypt(
      //     {
      //       key: priv,
      //       padding: crypto.constants.RSA_NO_PADDING,
      //     },
      //     Buffer.from(panId, "base64")
      //   )
      //   .toString("base64");
      // const passportId = crypto
      //   .privateDecrypt(
      //     {
      //       key: priv,
      //       padding: crypto.constants.RSA_NO_PADDING,
      //     },
      //     Buffer.from(passport, "base64")
      //   )
      //   .toString("base64");

      return {
        aadharId: aadharId,
        driversLicenseId: driversLicenseId,
        panId: panId,
        passport: passport,
        id: kyc.id,
        createdAt: kyc.createdAt,
      };
    },
  })
  .query("isKycDone", {
    input: z.object({
      id: z.string(),
    }),
    resolve: ({ ctx, input }) => {
      console.log(ctx.req.cookies);
      return true;
    },
  })
  .mutation("create_token", {
    resolve: async ({ ctx }) => {
      ctx.res.setHeader(
        "Set-Cookie",
        `kyc_token=verified; path=/; httpOnly; sameSite=strict`
      );
    },
  })
  .mutation("create", {
    input: z
      .object({
        aadharId: z.string().min(12).max(12),
        panId: z.string().min(10).max(10),
        driverLicenseId: z.string().min(7).max(7),
        passport: z.string().min(8).max(8),
      })
      .required(),

    resolve: async ({ input, ctx }) => {
      const cookie = ctx.req.headers.cookie;
      if (!cookie) {
        throw new Error("No cookie");
      }
      if (!cookie.includes("user_token")) {
        throw new Error("No token");
      }
      const token = cookie.split("user_token=")[1];
      let payload: any = null;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET as string);
      } catch (error) {
        throw new Error("Invalid token");
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      let { aadharId, driverLicenseId, panId, passport } = input;

      // aadharId = crypto
      //   .publicEncrypt(
      //     {
      //       key: Buffer.from(user.public_key),
      //     },
      //     Buffer.from(aadharId, "base64")
      //   )
      //   .toString("base64");

      // driverLicenseId = crypto
      //   .publicEncrypt(
      //     {
      //       key: Buffer.from(user.public_key),
      //     },
      //     Buffer.from(driverLicenseId, "base64")
      //   )
      //   .toString("base64");

      // panId = crypto
      //   .publicEncrypt(
      //     {
      //       key: Buffer.from(user.public_key),
      //     },
      //     Buffer.from(panId, "base64")
      //   )
      //   .toString("base64");

      // passport = crypto
      //   .publicEncrypt(
      //     {
      //       key: Buffer.from(user.public_key),
      //     },
      //     Buffer.from(passport, "base64")
      //   )
      //   .toString("base64");

      const kyc = await ctx.prisma.kYC.create({
        data: {
          aadharId: aadharId,
          panId: panId,
          driversLicenseId: driverLicenseId,
          passport: passport,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return kyc;
    },
  })
  .mutation("isAadharVerified", {
    input: z.object({
      frontImage: z.string(),
      backImage: z.string().optional(),
    }),

    resolve: async ({ input, ctx }) => {
      // const app = catalyst.initialize(ctx.req);
      // const zia = app.zia();
      // console.log(zia);
      // const res = await zia.extractAadhaarCharacters(
      //   fs.createReadStream("../../../images/image_back.jpg"),
      //   fs.createReadStream("../../../images/image_front.jpeg"),
      //   "hin,eng"
      // );
      // console.log(res);
      // // return res as string;

      console.log(input);

      const res1 = await ocrSpace(String(input.frontImage), {
        apiKey: "K86946407888957",
      });

      const aadhar = res1.ParsedResults[0].ParsedText.substring(
        26,
        res1.ParsedResults[0].ParsedText.length
      );

      return {
        value: aadhar,
      };
    },
  });
