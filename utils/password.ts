import bcrypt from "bcrypt";

export async function saltAndHashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
) {
  return bcrypt.compare(password, passwordHash);
}