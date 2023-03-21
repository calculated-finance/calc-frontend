export function formatSignedPercentage(value = 0) {
  const percentageString = `${Number((value * 100).toFixed(2))}%`;

  // if value is positive, add a plus sign. nothing if 0, minus sign if negative
  return value > 0 ? `+ ${percentageString}` : value < 0 ? `${percentageString}` : percentageString;
}
