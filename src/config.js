const dev = process.env.NODE_ENV !== "production";

export const server = dev
    ? "http://localhost:5000"
    : "http://137.184.100.179:6000";
