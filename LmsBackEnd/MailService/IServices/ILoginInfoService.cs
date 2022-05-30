using System.Threading.Tasks;

namespace LmsBackEnd
{
    public interface ILoginInfoService
    {
        Task<ACCOUNT> SignUp(ACCOUNT oRegisterInfo);
        Task<string> ConfirmMail(string username);

    }
}