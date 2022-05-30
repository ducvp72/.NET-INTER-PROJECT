using LmsBackEnd.ModelHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly LmsContext _context;
        private readonly IConfiguration _config;
        public CommentController(LmsContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        ///<summary>Xuất ra list comment của topic</summary>
        [HttpGet("List/{topicID}")]
        public async Task<ActionResult<Response>> ListTopicComment(string topicID)
        {
            var commentList = await _context.COMMENTs.
                Join(_context.ACCOUNTs,
                        comment => comment.AccountID,
                        account => account.ID,
                        (comment, account) => new
                        {
                            CommentID = comment.CommentID,
                            CommentDetail = comment.CommentDetail,
                            CommentTime = comment.CommentTime,
                            AccountID = comment.AccountID,
                            TopicID = comment.TopicID,
                            Name = account.Name
                        }).
                Where(c => c.TopicID == topicID).
                ToListAsync();

            if (commentList == null)
                return BadRequest("Không có comment nào!");

            return Ok(new Response { Data = commentList, Message = "Danh sách comment", Status = 200 });
        }

        ///<summary>Viết comment</summary>
        [HttpPost("CreateComment")]
        public async Task<IActionResult> CreateComment(CommentInput comment)
        {
            var checkTopic = await _context.TOPICs.AnyAsync(t => t.TopicID == comment.TopicID);
            if (!checkTopic)
                return BadRequest("Sai mã topic!");

            var checkAccount = await _context.ACCOUNTs.FirstOrDefaultAsync(a => a.ID == comment.AccountID);
            if (checkAccount == null)
                return BadRequest("Sai mã tài khoản!");

            COMMENT commentCreated = new COMMENT();
            //commentCreated.CommentID = AutoID();
            commentCreated.AccountID = comment.AccountID;
            commentCreated.TopicID = comment.TopicID;
            commentCreated.CommentDetail = comment.CommentDetail;
            commentCreated.CommentTime = DateTime.Now;
            commentCreated.AccountName = checkAccount.Name;

            await _context.COMMENTs.AddAsync(commentCreated);
            await _context.SaveChangesAsync();

            return Created("", commentCreated);
        }
    }
}
