import { supabase } from "../supabase/client";

export async function sendPasswordResetEmail(
  email: string,
  tempPassword: string,
) {
  // In a real app, this would use a proper email service
  // For now, we'll just log it
  console.log(
    `Password reset email sent to ${email} with temporary password: ${tempPassword}`,
  );

  // In production, you would use a service like SendGrid, AWS SES, etc.
  // const { error } = await supabase.functions.invoke('send-email', {
  //   body: { to: email, type: 'password-reset', tempPassword }
  // });

  // if (error) throw error;
}

export async function sendWelcomeEmail(email: string, tempPassword: string) {
  console.log(
    `Welcome email sent to ${email} with temporary password: ${tempPassword}`,
  );
}
