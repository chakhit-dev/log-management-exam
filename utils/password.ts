import bcrypt from "bcrypt";

export async function saltAndHashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  const verify = bcrypt.compare(password, passwordHash)
  
  return verify;
}