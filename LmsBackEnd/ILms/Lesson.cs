
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd
{
    public class Lesson : ILesson
    {
        private readonly LmsContext _context;

        public Lesson(LmsContext context)
        {
            _context = context;
        }
        public async Task AddLesson(LESSON lesson)
        {
            await _context.LESSONs.AddAsync(lesson);
        }

        public async Task DeleteLesson(LESSON lesson)
        {
            _context.LESSONs.Remove(lesson);
        }

        public async Task<IEnumerable<LESSON>> GetALL()
        {
            var less = await _context.LESSONs.ToListAsync();
            return less;
        }

        public async Task<LESSON> GetLessonByName(string name)
        {
            var less = await _context.LESSONs.FirstOrDefaultAsync(c => c.LessonName == name);
            return less;
        }

        public async Task<LESSON> GetLessonID(string id)
        {
            var less = await _context.LESSONs.FirstOrDefaultAsync(c => c.LessonID == id);
            return less;
        }

        public async Task SaveChange()
        {
            await _context.SaveChangesAsync();
        }

        public Task<IEnumerable<LESSON>> SearchLessonByID(string id)
        {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<LESSON>> SearchLessonByName(string name)
        {
            throw new System.NotImplementedException();
        }
    }
}