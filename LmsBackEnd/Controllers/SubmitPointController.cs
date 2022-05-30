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
    public class SubmitPointController : ControllerBase
    {
        private readonly LmsContext _context;

        public SubmitPointController(LmsContext context)
        {
            _context = context;
        }

        [HttpGet("ListSubmit")]
        public async Task<ActionResult<IEnumerable<POINT>>> ListSubmit()
        {
            return await _context.POINTs.ToListAsync();
        }

        [HttpGet("ListSubmitByFolder/{folderName}")]
        public async Task<ActionResult<IEnumerable<POINT>>> ListSubmitByFolder(string folderName)
        {
            return await _context.POINTs.Where(p => p.Folder == folderName).ToListAsync();
        }

        [HttpPut("ListSubmit/{id}")]
        public async Task<IActionResult> ChangeSubmitPoint(int id, int point)
        {
            var submit = await _context.POINTs.FirstOrDefaultAsync(s => s.ID == id);

            if (submit == null)
                return BadRequest("Sai mã submit!");

            if (point < 0 || point > 10)
                return BadRequest("chỉ nhập điểm từ 0 -> 10!");

            //_context.Entry(topic).State = EntityState.Modified;

            try
            {
                submit.point = point;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                
            }

            return Ok(new Response { Data = submit, Message = "Sửa điểm thành công!", Status = 200 });
        }
    }
}
