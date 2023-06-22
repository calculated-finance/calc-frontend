module.exports = {
  parseEther: jest.fn(),
  Contract: jest.fn().mockImplementation(() => {
    return {};
  }),
};
