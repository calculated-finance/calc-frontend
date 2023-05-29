export function toBase64<T>(obj: T): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}
