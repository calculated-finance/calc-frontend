import getDenomInfo from './getDenomInfo';

describe('getDenomInfo', () => {
  const { conversion, deconversion } = getDenomInfo('ukuji');

  it('converts properly', () => {
    expect(conversion(0.1)).toBe(0.00000010000000000000001);
    expect(conversion(0.9)).toBe(0.0000009000000000000001);
    expect(conversion(1)).toBe(0.000001);
    expect(conversion(1000000)).toBe(1);
    expect(conversion(1000000000000)).toBe(1000000);
  });

  it('deconverts properly', () => {
    expect(deconversion(0.0000001)).toBe(0);
    expect(deconversion(0.00000000000000000000001)).toBe(0);
    expect(deconversion(0.0000009)).toBe(1);
    expect(deconversion(0.000001)).toBe(1);
    expect(deconversion(0.0000011)).toBe(1);
    expect(deconversion(0.000001000000000000001)).toBe(1);
    expect(deconversion(0.0000019)).toBe(2);
    expect(deconversion(0.0000019999999999999999)).toBe(2);
    expect(deconversion(0.5)).toBe(500000);
    expect(deconversion(1)).toBe(1000000);
    expect(deconversion(1000000)).toBe(1000000000000);
  });
});
