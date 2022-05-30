using LmsBackEnd.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonController : ControllerBase
    {
        private readonly LmsContext _context;
        public LessonController(LmsContext context)
        {
            _context = context;
        }

        [HttpGet("List")]
        public async Task<ActionResult<IEnumerable<LESSON>>> ListLesson()
        {
            return await _context.LESSONs.ToListAsync();
        }

        [HttpPost("CreateLesson")]
        public async Task<IActionResult> CreateLesson(LessonInput lesson)
        {
            var checkID = await _context.LESSONs.FirstOrDefaultAsync(l => l.LessonID == lesson.LessonID);
            if (checkID != null)
                return BadRequest("Trùng mã bài học!");

            var course = await _context.COURSEs.FirstOrDefaultAsync(c => c.CourseID == lesson.CourseID);
            if (course == null)
                return BadRequest("Sai mã khóa học!");

            var lessonCreated = new LESSON();
            lessonCreated.LessonID = lesson.LessonID;
            lessonCreated.LessonName = lesson.LessonName;
            lessonCreated.LessonDetail = lesson.LessonDetail;
            lessonCreated.LessonDuration = lesson.LessonDuration;
            lessonCreated.CourseID = lesson.CourseID;
            lessonCreated.UrlLesson = lesson.UrlLesson;

            await _context.LESSONs.AddAsync(lessonCreated);
            await _context.SaveChangesAsync();

            return Created("", lesson);
        }
    }
}
