type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

export default function handler(_request: unknown, response: VercelResponse) {
  response.status(200).json({
    status: "ok",
    service: "kleros-audit-api",
    model: process.env.BRAIN_MODEL,
    baseUrl: process.env.BRAIN_BASE_URL,
    hasBrainKey: Boolean(process.env.BRAIN_API_KEY),
  });
}
