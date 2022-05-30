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
    public class TopicController : ControllerBase
    {
        private readonly LmsContext _context;
        public TopicController(LmsContext context)
        {
            _context = context;
        }

        ///<summary>Xuất danh sách topic</summary>
        [HttpGet("List")]
        public async Task<ActionResult<IEnumerable<TOPIC>>> ListTopic()
        {
            return await _context.TOPICs.Where(t => !t.IsOutDated).Include(t => t.COMMENTS).ToListAsync();
        }

        ///<summary>Tạo topic</summary>
        [HttpPost("CreateTopic")]
        public async Task<IActionResult> CreateTopic(TopicInput topic)
        {
            if (topic.TopicName == "")
                return BadRequest("Không được bỏ trống tên topic!");

            if (topic.TopicDetail == "")
                return BadRequest("Không được bỏ trống nội dung topic!");

            TOPIC t = new TOPIC();
            t.TopicID = AutoTopicID();
            t.TopicName = topic.TopicName;
            t.TopicDetail = topic.TopicDetail;

            await _context.TOPICs.AddAsync(t);
            await _context.SaveChangesAsync();

            return Created("", t);
        }

        ///<summary>Đổi topic IsOutdated = true</summary>
        [HttpPut("List/{id}")]
        public async Task<IActionResult> ChangeTopicStatus(string id)
        {
            var topic = await _context.TOPICs.FirstOrDefaultAsync(t => t.TopicID == id);

            if (topic == null)
                return BadRequest("Sai mã topic!");

            //_context.Entry(topic).State = EntityState.Modified;

            try
            {
                topic.IsOutDated = true;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TopicExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new Response { Data = topic, Message = "Đổi status thành công", Status = 200 });
        }

        private bool TopicExists(string id)
        {
            return _context.TOPICs.Any(t => t.TopicID == id);
        }

        private string AutoTopicID()
        {
            int idNumber = _context.TOPICs.Count();
            string ID = "T";

            if (idNumber < 10) return ID + "000" + idNumber.ToString();
            if (idNumber < 100) return ID + "00" + idNumber.ToString();
            if (idNumber < 1000) return ID + "0" + idNumber.ToString();

            return ID + idNumber.ToString();
        }
    }
}
