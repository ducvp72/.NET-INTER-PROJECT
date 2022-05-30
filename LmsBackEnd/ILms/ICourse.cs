
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LmsBackEnd
{
    public interface ICourse
    {
         Task<IEnumerable<COURSE>> GetALL();

         Task AddCourse(COURSE course);

         Task<COURSE> GetCourseID(string id);

         Task<COURSE> GetCourseByName(string name);

         Task<ENROLL> GetCourseByIdEnroll(string id, string courseid);

         Task DeleteCourse(COURSE course);

         Task<IEnumerable<COURSE>> SearchCourseByName(string name);

         Task<IEnumerable<COURSE>> SearchCourseByID(string name);
         
         Task SaveChange();
    }
}