function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  let kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + " KB";
  let mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(1) + " MB";
  let gb = mb / 1024;
  return gb.toFixed(1) + " GB";
}
module.exports = formatFileSize;