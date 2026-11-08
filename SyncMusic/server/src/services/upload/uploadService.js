// TODO: Store user-owned audio in object storage, never on ephemeral app disk.
export async function storeUpload(file, user) {
  if (!file) throw new Error('Upload file is required');
  return { ownerId: user.userId, originalName: file.originalname, size: file.size, status: 'pending-storage-adapter' };
}
