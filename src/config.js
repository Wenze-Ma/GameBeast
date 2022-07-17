const dev = process.env.NODE_ENV !== "production";

export const server = dev
    ? "http://localhost:5000"
    : "http://192.168.1.3:5000";
