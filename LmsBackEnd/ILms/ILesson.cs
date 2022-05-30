
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LmsBackEnd
{
    public interface ILesson
    {
         Task<IEnumerable<LESSON>> GetALL();

         Task AddLesson(LESSON lesson);

         Task<LESSON> GetLessonID(string id);

         Task<LESSON> GetLessonByName(string name);


         Task DeleteLesson(LESSON lesson);

         Task<IEnumerable<LESSON>> SearchLessonByName(string name);

         Task<IEnumerable<LESSON>> SearchLessonByID(string id);
         
         Task SaveChange();
    }
}