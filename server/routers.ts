import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { storagePut, storageDelete } from "./storage";
import { createUpload, getUserUploads, deleteUpload, createProduct, getAllProducts, getProductById } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // File upload management
  files: router({
    // Get all uploads for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserUploads(ctx.user.id);
    }),

    // Upload a file to S3 and store metadata in database
    upload: protectedProcedure
      .input(
        z.object({
          fileName: z.string().min(1),
          fileData: z.string(), // base64 encoded file data
          mimeType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Decode base64 to buffer
          const buffer = Buffer.from(input.fileData, "base64");
          const fileSize = buffer.length;

          // Generate unique file key with user ID and timestamp
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(7);
          const fileKey = `jewelry/${ctx.user.id}/${timestamp}-${randomSuffix}-${input.fileName}`;

          // Upload to S3
          const { url } = await storagePut(fileKey, buffer, input.mimeType);

          // Store metadata in database
          await createUpload({
            userId: ctx.user.id,
            fileName: input.fileName,
            fileKey,
            fileUrl: url,
            mimeType: input.mimeType,
            fileSize,
          });

          return {
            success: true,
            url,
            fileKey,
            fileName: input.fileName,
          };
        } catch (error) {
          console.error("File upload error:", error);
          throw new Error("Failed to upload file");
        }
      }),

    // Delete an uploaded file
    delete: protectedProcedure
      .input(z.object({ uploadId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        try {
          const upload = await deleteUpload(input.uploadId, ctx.user.id);

          // Delete from S3
          await storageDelete(upload.fileKey);

          return { success: true };
        } catch (error) {
          console.error("File deletion error:", error);
          throw new Error("Failed to delete file");
        }
      }),
  }),

  // Product management
  products: router({
    // Get all products
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),

    // Get a specific product
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProductById(input.id);
      }),

    // Create a new product (admin only)
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          category: z.string().min(1),
          price: z.number().int().positive(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }

        try {
          await createProduct({
            name: input.name,
            description: input.description,
            category: input.category,
            price: input.price,
            imageUrl: input.imageUrl,
            imageKey: input.imageKey,
          });

          return { success: true };
        } catch (error) {
          console.error("Product creation error:", error);
          throw new Error("Failed to create product");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
