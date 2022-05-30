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
    public class ResponsibilityController : ControllerBase
    {
        public readonly LmsContext _context;
        public ResponsibilityController(LmsContext context)
        {
            _context = context;
        }

        ///<summary>danh sách giáo viên</summary>
        [HttpGet("TeacherList")]
        public async Task<ActionResult<ICollection<ACCOUNT>>> GetTeacherList()
        {
            return await _context.ACCOUNTs.AsNoTracking().Where(a => a.UserRole == "teacher").ToListAsync();
        }

        ///<summary>danh sách khóa học</summary>
        [HttpGet("CourseList")]
        public async Task<ActionResult<ICollection<COURSE>>> GetCourseList()
        {
            return await _context.COURSEs.AsNoTracking().ToListAsync();
        }

        ///<summary>Assing giáo viên vào khóa học</summary>
        [HttpPost("AssignTeacher")]
        public async Task<ActionResult> AssignTeacher(string AccountID, string CourseID)
        {
            var teacher = await _context.ACCOUNTs.AsNoTracking().FirstOrDefaultAsync(a => a.ID == AccountID && a.UserRole == "teacher");
            if (teacher == null)
                return BadRequest("Sai mã giáo viên!");

            var course = await _context.COURSEs.AsNoTracking().FirstOrDefaultAsync(c => c.CourseID == CourseID);
            if(course == null)
                return BadRequest("Sai mã khóa học!");

            var responsibility = new RESPONSIBILITY();
            responsibility.AccountID = AccountID;
            responsibility.CourseID = CourseID;

            await _context.RESPONSIBILITIes.AddAsync(responsibility);
            await _context.SaveChangesAsync();

            return Ok(new Response { Status = 200, Data = responsibility, Message = "Đã thêm giáo viên phụ trách!" });
        }

        ///<summary>danh sách phân công giáo viên</summary>
        [HttpGet("ListResponsibility")]
        public async Task<ActionResult<ICollection<RESPONSIBILITY>>> GetReponsibilityList()
        {
            return await _context.RESPONSIBILITIes.AsNoTracking().Include(r => r.ACCOUNT).Include(r => r.COURSE).ToListAsync();
        }
    }
}
