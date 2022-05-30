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
    public class HomeController : ControllerBase
    {
        private readonly LmsContext _context;

        public HomeController(LmsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<COURSE>>> GetCourses()
        {
            return await _context.COURSEs.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<COURSE>> GetCourse(string id)
        {
            var course = await _context.COURSEs.FindAsync(id);

            if (course == null)
            {
                return NotFound("Không tìm thấy");
            }

            return course;
        }

        [HttpGet("Search")]
        public async Task<ActionResult<IEnumerable<COURSE>>> SearchCourse(string searchString)
        {
            var courses = await _context.COURSEs.AsNoTracking().Where(c => c.CourseName.Contains(searchString)).ToListAsync();

            if (courses == null)
            {
                return NotFound("Không tìm thấy");
            }

            return courses;
        }
    }
}
