"use client"

export type ZipFileInput = {
  filename: string
  blob: Blob
}

export async function createStickerZip(files: ZipFileInput[]) {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()
  const fileBuffers = await Promise.all(
    files.map(async (file) => ({
      filename: file.filename,
      data: await file.blob.arrayBuffer(),
    })),
  )
  fileBuffers.forEach((file) => zip.file(file.filename, file.data))
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/zip",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  })
}
