import { customAlphabet } from "nanoid";

export const generateShortCode = (): string => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 6); // Generates 6-character code
  return nanoid();
};
