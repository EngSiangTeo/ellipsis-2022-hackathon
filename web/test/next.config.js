module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/deposit",
        destination: "http://127.0.0.1:4001/deposit",
      },
      {
        source: "/withdraw",
        destination: "http://127.0.0.1:4001/withdraw",
      },
    ];
  };
  return {
    rewrites,
  };
};