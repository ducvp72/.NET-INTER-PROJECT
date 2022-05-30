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
    public class ClassMemberController : ControllerBase
    {
        private readonly LmsContext _context;

        public ClassMemberController(LmsContext context)
        {
            _context = context;
        }

        ///<summary>danh sách instructor</summary>
        [HttpGet("ListInstructor")]
        public async Task<ActionResult<ICollection<ACCOUNT>>> GetInstructorList()
        {
            return await _context.ACCOUNTs.AsNoTracking().Where(a => a.UserRole == "instructor").ToListAsync();
        }

        ///<summary>danh sách mentor</summary>
        [HttpGet("ListMentor")]
        public async Task<ActionResult<ICollection<ACCOUNT>>> GetMentorList()
        {
            return await _context.ACCOUNTs.AsNoTracking().Where(a => a.UserRole == "mentor").ToListAsync();
        }

        ///<summary>danh sách class admin</summary>
        [HttpGet("ListClassAdmin")]
        public async Task<ActionResult<ICollection<ACCOUNT>>> GetClassAdminList()
        {
            return await _context.ACCOUNTs.AsNoTracking().Where(a => a.UserRole == "classadmin").ToListAsync();
        }

        ///<summary>danh sách khóa học</summary>
        [HttpGet("CourseList")]
        public async Task<ActionResult<ICollection<COURSE>>> GetCourseList()
        {
            return await _context.COURSEs.AsNoTracking().ToListAsync();
        }

        ///<summary>danh sách instructor, mentor, class admin của khóa học</summary>
        [HttpGet("ListClassMember")]
        public async Task<ActionResult<ICollection<CLASSMEMBER>>> GetClassMemberList()
        {
            return await _context.CLASSMEMBERs.AsNoTracking().
                Include(r => r.COURSE).
                Include(r => r.INSTRUCTOR).
                Include(r => r.MENTOR).
                Include(r => r.CLASSADMIN).           
                ToListAsync();
        }

        ///<summary>danh sách instructor, mentor, class admin của khóa học theo CourseID</summary>
        [HttpGet("ListClassMemberByCourse")]
        public async Task<ActionResult<ICollection<CLASSMEMBER>>> GetClassMemberListByCourse(string CourseID)
        {
            return await _context.CLASSMEMBERs.AsNoTracking().
                Include(r => r.COURSE).
                Include(r => r.INSTRUCTOR).
                Include(r => r.MENTOR).
                Include(r => r.CLASSADMIN).
                Where(r => r.CourseID == CourseID).
                ToListAsync();
        }

        ///<summary>Assing instructor, mentor và class admin vào khóa học</summary>
        [HttpPost("AssignClassMember")]
        public async Task<ActionResult> AssignClassMember(string CourseID, string InstructorID, string MentorID, string ClassAdminID)
        {
            //var instructor = await _context.ACCOUNTs.AsNoTracking().FirstOrDefaultAsync(a => a.ID == InstructorID && a.UserRole == "instructor");
            //if (instructor == null)
            //    return BadRequest("Sai mã Instructor!");

            //var mentor = await _context.ACCOUNTs.AsNoTracking().FirstOrDefaultAsync(a => a.ID == MentorID && a.UserRole == "mentor");
            //if (mentor == null)
            //    return BadRequest("Sai mã Mentor!");

            //var classAdmin = await _context.ACCOUNTs.AsNoTracking().FirstOrDefaultAsync(a => a.ID == ClassAdminID && a.UserRole == "classadmin");
            //if (classAdmin == null)
            //    return BadRequest("Sai mã Class Admin!");

            //var course = await _context.COURSEs.AsNoTracking().FirstOrDefaultAsync(c => c.CourseID == CourseID);
            //if (course == null)
            //    return BadRequest("Sai mã khóa học!");

            var classMember = new CLASSMEMBER();
            classMember.CourseID = CourseID;
            classMember.InstructorID = InstructorID;
            classMember.MentorID = MentorID;
            classMember.ClassAdminID = ClassAdminID;

            await _context.CLASSMEMBERs.AddAsync(classMember);
            await _context.SaveChangesAsync();

            return Ok(new Response { Status = 200, Data = classMember, Message = "Đã thêm giáo viên phụ trách!" });
        }
    }
}
