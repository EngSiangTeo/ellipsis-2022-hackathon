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
      {
        source: "/onboard",
        destination: "http://127.0.0.1:4001/onboard",
      },
      {
        source: "/login",
        destination: "http://127.0.0.1:4001/login",
      },
      {
        source: "/loans",
        destination: "http://127.0.0.1:4001/loan",
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:4001/:path*' // Proxy to Backend
      }
    ];
  };
  return {
    rewrites,
    env: {
      NEXT_PUBLIC_GOLD_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_GOLD_TOKEN_ADDRESS,
      NEXT_PUBLIC_LOAN_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_LOAN_CONTRACT_ADDRESS,
    }
  };
};