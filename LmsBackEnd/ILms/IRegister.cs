

using System.Collections.Generic;
using System.Threading.Tasks;

namespace LmsBackEnd.Controllers
{
    public interface IRegister
    {
        Task<IEnumerable<ACCOUNT>> GetALL();

        Task AddUser (ACCOUNT aCCOUNT);

        Task<ACCOUNT> GetUserID(string id);

        Task<ACCOUNT> GetByName(string name);

        Task<ACCOUNT> GetByEmail(string name);

        public void DeleteUserID(ACCOUNT aCCOUNT);

        
        Task SaveChange();
    }
}