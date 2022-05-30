
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd
{
    public class  Course : ICourse
    {
        private readonly LmsContext _context;
        
        public Course(LmsContext context)
        {
            _context = context;
        }

        public async Task AddCourse(COURSE course)
        {
            if(course == null)
            {
                throw new ArgumentNullException(nameof(course));
            }
            await _context.COURSEs.AddAsync(course);
        }

        public async Task DeleteCourse(COURSE course)
        {
             _context.COURSEs.Remove(course);
        }

        public async Task<IEnumerable<COURSE>> GetALL()
        {
            var courselst = await _context.COURSEs.ToListAsync();
            return courselst;
        }

        public async Task<COURSE> GetCourseByName(string name)
        {
            var courseName = await _context.COURSEs.FirstOrDefaultAsync(c => c.CourseName == name);
            return courseName;
        }

        public async Task<COURSE> GetCourseID(string id)
        {
            var courseID = await _context.COURSEs.FirstOrDefaultAsync(c => c.CourseID == id);
            return courseID;
        }

        public async Task SaveChange()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<COURSE>> SearchCourseByID(string id)
        {
            var courseID =    _context.COURSEs.Where(c =>c.CourseID.Contains(id));
            return courseID;
        }

        public async Task<IEnumerable<COURSE>> SearchCourseByName(string name)
        {
            var courseName =  _context.COURSEs.Where(c =>c.CourseName.Contains(name));
            return courseName;
        }

        public async Task<ENROLL> GetCourseByIdEnroll(string id, string courseId)
        {
            var enroll = await _context.ENROLLs.FirstOrDefaultAsync(x => x.AccountID == id && x.CourseID == courseId);
            return enroll;
        }

    }
}