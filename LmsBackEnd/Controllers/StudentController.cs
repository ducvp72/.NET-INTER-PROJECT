using LmsBackEnd.ModelHelper;
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
    public class StudentController : ControllerBase
    {
        private readonly LmsContext _context;
        public StudentController(LmsContext context)
        {
            _context = context;
        }

        ///<summary>xuất toàn bộ danh sách học viên(viết phòng hờ có thể ko cần dùng)</summary>
        [HttpGet("List")]
        public async Task<ActionResult<IEnumerable<ACCOUNT>>> ListAccount()
        {
            return await _context.ACCOUNTs.Where(a => a.UserRole == "student").ToListAsync();
        }

        ///<summary>xuất toàn bộ học viên của 1 khóa học</summary>
        [HttpGet("ListByCourse/{courseID}")]
        public async Task<ActionResult<Response>> ListAccountByCourse(string courseID)
        {
            var student = await _context.ACCOUNTs.
                Join(_context.ENROLLs,
                        account => account.ID,
                        enroll => enroll.ACCOUNT.ID,
                        (account, enroll) => new
                        {
                            StudentID = account.ID,
                            Name = account.Name,
                            GioiTinh = account.GioiTinh,
                            NgaySinh = account.NgaySinh,
                            UserRole = account.UserRole,
                            Email = account.Email,
                            Phone = account.Phone,
                            CourseID = enroll.CourseID,
                            Score1 = enroll.Score1,
                            Score2 = enroll.Score2,
                            AvgScore = enroll.AvgScore
                        }).
                Where(a => a.UserRole == "student" && a.CourseID == courseID).
                ToListAsync();

            if (student == null)
                return BadRequest("Không tìm thấy học viên!");

            return Ok(new Response { Data = student, Message = "Danh sách học viên", Status = 200 });
        }

        ///<summary>Lấy thông tin học viên thuộc khóa học</summary>
        [HttpGet("ListByCourse/{courseID}/{id}")]
        public async Task<ActionResult<StudentInfo>> StudentInfo(string courseID, string id)
        {
            var student = await _context.ACCOUNTs.FirstOrDefaultAsync(a => a.ID == id);
            var enroll = await _context.ENROLLs.FirstOrDefaultAsync(e => e.CourseID == courseID && e.AccountID == id);

            StudentInfo info = new StudentInfo();
            info.StudentID = id;
            info.Name = student.Name;
            info.NgaySinh = student.NgaySinh;
            info.GioiTinh = student.GioiTinh;
            info.Phone = student.Phone;
            info.Email = student.Email;
            info.Score1 = enroll.Score1;
            info.Score2 = enroll.Score2;
            info.AvgScore = enroll.AvgScore;

            return Ok(info);
        }

        ///<summary>Tìm học viên</summary>
        [HttpGet("SearchStudent")]
        public async Task<ActionResult<IEnumerable<ACCOUNT>>> SearchStudent(string name)
        {
            return await _context.ACCOUNTs.Where(a => a.Name.Contains(name)).ToListAsync();
        }

        ///<summary>Thêm học viên vào khóa học</summary>
        [HttpPost("ListByCourse/{courseID}/AddStudent")]
        public async Task<IActionResult> AddStudent(string accountID, string courseID)
        {
            var CheckID = await _context.ACCOUNTs.AnyAsync(a => a.ID == accountID && a.UserRole == "student");
            if (!CheckID)
                return BadRequest("Sai mã học viên!");

            var CheckEnroll = await _context.ENROLLs.AnyAsync(e => e.AccountID == accountID && e.CourseID == courseID);
            if (CheckEnroll)
                return BadRequest("Đã có học viên trong khóa học!");

            ENROLL enroll = new ENROLL();
            enroll.AccountID = accountID;
            enroll.CourseID = courseID;

            await _context.ENROLLs.AddAsync(enroll);
            await _context.SaveChangesAsync();

            return Created("", enroll);
        }

        ///<summary>Xóa học viên khỏi khóa học</summary>
        [HttpDelete("DeleteStudent")]
        public async Task<IActionResult> DeleteStudent(string accountID, string courseID)
        {
            var enroll = await _context.ENROLLs.FirstOrDefaultAsync(e => e.AccountID == accountID && e.CourseID == courseID);
            if (enroll == null)
                return BadRequest("Không có học viên trong khóa học!");

            _context.ENROLLs.Remove(enroll);
            await _context.SaveChangesAsync();

            return Ok("Đã xóa");
        }

        ///<summary>Sửa điểm cho học viên</summary>
        [HttpPut("WriteScore")]
        public async Task<IActionResult> WriteScore(string accountID, string courseID, int score1, int score2)
        {
            var enroll = await _context.ENROLLs.FirstOrDefaultAsync(e => e.AccountID == accountID && e.CourseID == courseID);
            if (enroll == null)
                return BadRequest("Không có học viên trong khóa học!");

            try
            {
                enroll.Score1 = score1;
                enroll.Score2 = score2;
                enroll.AvgScore = (score1 + score2) / 2;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (enroll == null)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new Response { Data = enroll, Message = "Nhập điểm thành công", Status = 200 });
        }
    }
}
