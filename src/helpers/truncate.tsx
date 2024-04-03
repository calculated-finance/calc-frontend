export function truncate(str: string | null) {
  if (str == null) {
    throw new Error('truncate: String is null');
  }

  if (str.length <= 10) {
    return str;
  }

  return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
}
