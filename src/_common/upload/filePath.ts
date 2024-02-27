export function saveFile(filename) {
  const len = filename.split('.').length;
  const ext = filename.split('.')[len - 1];

  const extensionsForImages = ['jpg', 'jpeg', 'png', 'gif'];
  const extensionsForvideos = ['mp4', 'mp3'];
  const extensionsForDocs = ['pdf', 'docx'];

  let filePath;
  if (extensionsForImages.includes(ext)) {
    return (filePath = `uploads/images/${filename}`);
  } else if (extensionsForvideos.includes(ext)) {
    return (filePath = `uploads/videos/${filename}`);
  } else if (extensionsForDocs.includes(ext)) {
    return (filePath = `uploads/documents/${filename}`);
  }
}
