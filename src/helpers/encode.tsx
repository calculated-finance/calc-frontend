export function encode(msg: any) {
  const raw = JSON.stringify(msg);
  const textEncoder = new TextEncoder();
  return textEncoder.encode(raw);
}
