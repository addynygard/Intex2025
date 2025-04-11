using Microsoft.AspNetCore.Identity;

public class NoOpEmailSender<TUser> : IEmailSender<TUser> where TUser : class
{
    public Task SendConfirmationLinkAsync(TUser user, string email, string confirmationLink)
    {
        Console.WriteLine($"[NoOpEmailSender] Confirmation link: {confirmationLink}");
        return Task.CompletedTask;
    }

    public Task SendPasswordResetLinkAsync(TUser user, string email, string resetLink)
    {
        Console.WriteLine($"[NoOpEmailSender] Password reset link: {resetLink}");
        return Task.CompletedTask;
    }

    public Task SendPasswordResetCodeAsync(TUser user, string email, string resetCode)
    {
        Console.WriteLine($"[NoOpEmailSender] Password reset code: {resetCode}");
        return Task.CompletedTask;
    }
}
