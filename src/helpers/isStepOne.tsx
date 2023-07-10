export function isStepOne(path: string) {
    if (path.includes('assets')) {
      return true;
    }
    return false;
  }