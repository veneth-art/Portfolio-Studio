export {};

declare global {
  interface Env {
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    ALLOWED_ORIGIN?: string;
  }

  interface R2Object {
    key: string;
    version: string;
    size: number;
    httpEtag: string;
    httpMetadata: {
      contentType?: string;
      contentLanguage?: string;
      contentDisposition?: string;
      contentEncoding?: string;
      cacheControl?: string;
    };
    customMetadata: Record<string, string>;
    uploaded: Date;
    body: ReadableStream | null;
  }
}
