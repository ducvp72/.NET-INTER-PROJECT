
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LmsBackEnd
{
    public interface INotify
    {
         Task<IEnumerable<NOTIFY>> GetALLAdmin();
         Task<IEnumerable<NOTIFY>> GetALL();

         Task AddNotify(NOTIFY notify);

         Task<NOTIFY> GetNotifyID(string id);

         Task<NOTIFY> GetNotifyByName(string name);


         Task DeleteNotify(NOTIFY notify);

         Task<IEnumerable<NOTIFY>> SearchNotifyByName(string name);

         Task<IEnumerable<NOTIFY>> SearchNotifyByID(string id);
         
         Task SaveChange();
    }
}