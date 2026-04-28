export function isAdminEmail(email) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) {
    return false;
  }

  return email.toLowerCase() === adminEmail.toLowerCase();
}
