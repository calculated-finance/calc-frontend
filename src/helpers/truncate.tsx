
export function truncate(str: string | null) {
  if (str == null) {
    throw new Error('truncate: String is null');
  }

  return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
}
