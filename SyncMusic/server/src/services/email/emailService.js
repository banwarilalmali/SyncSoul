// TODO: Integrate an email provider for password-reset and verification messages.
export async function sendPasswordResetEmail(_email, _token) {
  return { accepted: false, reason: 'Email provider not configured' };
}
