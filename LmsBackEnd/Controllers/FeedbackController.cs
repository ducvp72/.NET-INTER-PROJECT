
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd
{
    [Route("api/controller")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly LmsContext _context;
        private readonly IFeedback _feedback;
        private readonly IMapper _mapper;

        public FeedbackController(LmsContext context, IFeedback feedback, IMapper mapper)
        {
            _context = context;
            _feedback = feedback;
            _mapper = mapper;
        }

        ///<summary>Danh sách các feedback câu hỏi khảo sát</summary>
        [HttpGet("ALLQuestionList")]
        public async Task<ActionResult<IEnumerable<FeedbackQuestion>>> GetAllQues()
        {
            var ques = await _context.FEEDBACKs.ToListAsync();
            var readAnswer = _mapper.Map<IEnumerable<FeedbackQuestion>>(ques);
            return Ok(readAnswer);
        }

        ///<summary>Danh sách câu hỏi theo Id</summary>
        [HttpGet("QuestionListByID/{id}")]
        public async Task<ActionResult<IEnumerable<FEEDBACK>>> GetQuesByID(string id)
        {
            var feedid = await _feedback.getFeedByID(id);
            if (feedid == null)
            {
                return BadRequest(new Response { Data = "", Message = "ID feedback trống hoặc không tòn tại", Status = 400 });
            }
            var readAnswer = _mapper.Map<FeedbackQuestion>(feedid);
            return Ok(readAnswer);
        }

        ///<summary>Danh sách các khảo sát</summary>
        [HttpGet("QuestionList")]
        public async Task<ActionResult<IEnumerable<FeedbackQuestion>>> GetAll()
        {
            var ques = await _context.FEEDBACKs.ToListAsync();
            return Ok(ques);
        }

        ///<summary>Danh sách các Feedback cho thầy cô với từng đánh giá</summary>
        [HttpGet("FeedbackQuestionList")]
        public async Task<ActionResult<IEnumerable<FEEDBACK>>> GetAllQuesByTeacher()
        {
            var ques = await _feedback.GetAllQues();
            var readAnswer = _mapper.Map<IEnumerable<FeedbackAnswer>>(ques);
            return Ok(readAnswer);
        }

        ///<summary>Lấy Feedback theo ID cho thầy cô với từng đánh giá</summary>
        [HttpGet("ByIdFeed/{id}")]
        public async Task<ActionResult<IEnumerable<FEEDBACK>>> byId(string id)
        {
            var ques = await _feedback.getFeedByID(id);
            var readAnswer = _mapper.Map<FeedbackAnswer>(ques);
            return Ok(readAnswer);
        }

        ///<summary>Danh sách các feedback từ sv</summary>
        [HttpGet("FeedbackAnswerList")]
        public async Task<ActionResult<IEnumerable<FEEDBACKATTEMP>>> GetAllAnswer()
        {
            var answer = await _feedback.GetAllAnswer();
            var readAnswer = _mapper.Map<IEnumerable<FEEDBACKATTEMP>, IEnumerable<ReadFeedbackAttemp>>(answer);
            return Ok(readAnswer);
        }

        ///<summary>Tao Feedback</summary>
        [HttpPost("CreateFeedback")]
        public async Task<ActionResult<Response>> CreateFeedback(CreateFeedback feedback)
        {
            var feedmodels = _mapper.Map<FEEDBACK>(feedback);
            feedmodels.FeedbackID = AutoFeedID();
            await _feedback.CreateFeedback(feedmodels);
            await _feedback.SaveChange();
            return Created("", feedmodels);
        }

        ///<summary>Tra loi Feedback</summary>
        [HttpPost("Feedback")]
        public async Task<ActionResult<Response>> AnswerFeedback(CreateFeedbackattemp feedbackattemp)
        {
            var feed = await _feedback.getFeedByID(feedbackattemp.FeedbackID);
            // var answer = _feedback.getFeedByID(feedbackattemp.FeedbackID);
            var feedbackModel = _mapper.Map<FEEDBACKATTEMP>(feedbackattemp);

            if (feed != null)
            {
                var check = await GetFeedByIdUser(feedbackattemp.AccountID, feedbackattemp.FeedbackID);
                if (check != null)
                {
                    return BadRequest(new Response { Data = "", Message = "User đã khảo sát Feedback rồi !", Status = 400 });
                }
                await _feedback.AnswerFeedback(feedbackModel);
                await _feedback.SaveChange();
                //  _context.Entry(feedbackModel).Reference(s => s.Feedback).Load();
                var x = await _feedback.getFeedAByID(feedbackModel.FeedbackAttempID);
                var readFeedbackAttemp = _mapper.Map<ReadFeedbackAttemp>(x);
                return Created("", new Response { Data = readFeedbackAttemp, Message = "Feedback giáo viên", Status = 200 });
            }
            return BadRequest(new Response { Data = "", Message = "Không tồn tại ID", Status = 400 });
        }

        private string AutoFeedID()
        {
            int idNumber = _context.FEEDBACKs.Count();
            string ID = "Fb";

            if (idNumber < 10) return ID + "000" + idNumber.ToString();
            if (idNumber < 100) return ID + "00" + idNumber.ToString();
            if (idNumber < 1000) return ID + "0" + idNumber.ToString();

            return ID + idNumber.ToString();
        }

        ///<summary>Check da khao sat</summary>
        [HttpHead("FeedbackCheck")]
        public async Task<FEEDBACKATTEMP> GetFeedByIdUser(string id, string feedId)
        {
            var enroll = await _context.FEEDBACKATTEMPs.FirstOrDefaultAsync(x => x.AccountID == id && x.FeedbackID == feedId);
            return enroll;
        }
    }
}