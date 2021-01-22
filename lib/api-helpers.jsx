export function extractBin(req) {
  if (!req.bin) return null

  const {
    name, description, item_uuids, image_uuid, icon
  } = req.bin
  return {
    name, description, item_uuids, image_uuid, icon
  }
}