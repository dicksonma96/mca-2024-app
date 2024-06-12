export default function (num) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (num < 0 || num > 26) {
    throw new Error("Number must be between 1 and 26");
  }
  return alphabet[num];
}
