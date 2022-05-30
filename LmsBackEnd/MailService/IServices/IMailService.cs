using System.Threading.Tasks;
using LmsBackEnd.Models;

namespace LmsBackEnd
{
    public interface IMailService
    {
        Task<string> SendMail(MailModel oMailModel);
        string GetMailBody(ACCOUNT oRegisterModel);
        string GetMailBodyChangeEmail(string userid, string email);
        string GetMailBodyChangePassword(string id);
    }
}
