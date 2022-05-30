using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using LmsBackEnd.Controllers;

namespace LmsBackEnd
{
    public class LoginInfoService : ILoginInfoService
    {

        private readonly IRegister _register;
        public LoginInfoService(IRegister register)
        {
            _register = register;
        }
        ACCOUNT _oRegisterModel = new ACCOUNT();
        public async Task<string> ConfirmMail(string username)
        {
            try
            {
                if (string.IsNullOrEmpty(username)) return "Invalid username!";

                ACCOUNT oRegisterModel = new ACCOUNT()
                {
                    UserName = username
                };

                var registerModel = await this._register.GetByName(username);
                if (registerModel == null)
                {
                    return Message.InvalidUser;
                }
                else
                {
                    registerModel.UserRole = "student";
                    registerModel.IsMailConfirmed = true;
                    await _register.SaveChange();
                    return Message.Success;

                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public Task<ACCOUNT> SignUp(ACCOUNT oRegisterInfo)
        {
            throw new NotImplementedException();
        }
    }
}