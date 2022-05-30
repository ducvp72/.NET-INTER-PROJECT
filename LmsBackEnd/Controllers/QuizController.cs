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
    public class QuizController : ControllerBase
    {
        private readonly LmsContext _context;
        public QuizController(LmsContext context)
        {
            _context = context;
        }

        ///<summary>Xuất toàn bộ quiz</summary>
        [HttpGet("List")]
        public async Task<ActionResult<IEnumerable<QUIZ>>> ListQuiz()
        {
            return await _context.QUIZs.Include(q => q.QUIZBODYS).ToListAsync();
        }

        ///<summary>Xuất thông tin của một quiz</summary>
        [HttpGet("{quizID}")]
        public async Task<ActionResult<IEnumerable<QUIZ>>> GetQuizByID(string quizID)
        {
            var quiz = await _context.QUIZs.Where(q => q.QuizID == quizID).ToListAsync();
            if (quiz == null)
            {
                return NotFound("Không tìm thấy bài quiz");
            }
            return quiz;
        }

        ///<summary>Xuất toàn bộ question của quiz</summary>
        [HttpGet("ListQuestion")]
        public async Task<ActionResult<IEnumerable<QUIZBODY>>> ListQuestion(string QuizID)
        {
            return await _context.QUIZBODIes.Where(q => q.QuizID == QuizID).ToListAsync();
        }

        ///<summary>Tạo quiz</summary>
        [HttpPost("CreateQuiz")]
        public async Task<IActionResult> CreateQuestion(QuizInput quiz)
        {
            var checkQuiz = await _context.QUIZs.AnyAsync(q => q.QuizID == quiz.QuizID);
            if (checkQuiz)
                return BadRequest("Trùng mã quiz!");

            var checkLesson = await _context.LESSONs.AnyAsync(l => l.LessonID == quiz.LessonID);
            if (!checkLesson)
                return BadRequest("Sai mã bài học!");

            QUIZ quizCreated = new QUIZ();
            quizCreated.QuizID = quiz.QuizID;
            quizCreated.QuizName = quiz.QuizName;
            quizCreated.QuizDetail = quiz.QuizDetail;
            quizCreated.StartTime = quiz.StartTime;
            quizCreated.EndTime = quiz.EndTime;
            quizCreated.LessonID = quiz.LessonID;

            await _context.QUIZs.AddAsync(quizCreated);
            await _context.SaveChangesAsync();

            return Created("", quiz);
        }


        ///<summary>Tạo question cho quiz</summary>
        [HttpPost("CreateQuestion")]
        public async Task<IActionResult> CreateQuestion(QuestionInput question, string QuizID)
        {
            QUIZBODY body = new QUIZBODY();
            body.QuestionNo = question.QuestionNo;
            body.Question = question.Question;
            body.QuestionScore = question.QuestionScore;
            body.QuizID = QuizID;
            body.RightAnswer = question.RightAnswer;
            body.WrongAnswer1 = question.WrongAnswer1;
            body.WrongAnswer2 = question.WrongAnswer2;
            body.WrongAnswer3 = question.WrongAnswer3;

            await _context.QUIZBODIes.AddAsync(body);
            await _context.SaveChangesAsync();

            return Created("", question);
        }

        ///<summary>Lấy question và trộn đáp án</summary>
        [HttpGet("GetQuestion")]
        public async Task<IActionResult> GetQuestion(string QuizID, int QuestionNo)
        {
            var question = await _context.QUIZBODIes.FirstOrDefaultAsync(q => q.QuizID == QuizID && q.QuestionNo == QuestionNo);

            QuestionOutput output = new QuestionOutput();
            output.QuestionNo = QuestionNo;
            output.Question = question.Question;
            output.QuestionScore = question.QuestionScore;
            output.QuizID = QuizID;

            Random rand = new Random();
            output.RightChoice = rand.Next(0, 4);

            GenerateAnswer(question, ref output, output.RightChoice);

            return Ok(output);
        }

        private void GenerateAnswer(QUIZBODY question, ref QuestionOutput output, int rightChoice)
        {
            switch (rightChoice)
            {
                case 0:
                    output.Answer1 = question.RightAnswer;
                    output.Answer2 = question.WrongAnswer1;
                    output.Answer3 = question.WrongAnswer2;
                    output.Answer4 = question.WrongAnswer3;
                    break;
                case 1:
                    output.Answer2 = question.RightAnswer;
                    output.Answer1 = question.WrongAnswer1;
                    output.Answer3 = question.WrongAnswer2;
                    output.Answer4 = question.WrongAnswer3;
                    break;
                case 2:
                    output.Answer3 = question.RightAnswer;
                    output.Answer2 = question.WrongAnswer1;
                    output.Answer1 = question.WrongAnswer2;
                    output.Answer4 = question.WrongAnswer3;
                    break;
                case 3:
                    output.Answer4 = question.RightAnswer;
                    output.Answer2 = question.WrongAnswer1;
                    output.Answer3 = question.WrongAnswer2;
                    output.Answer1 = question.WrongAnswer3;
                    break;
            }
        }

        ///<summary>kiểm tra đáp án</summary>
        [HttpPost("GetQuestion/{QuizID}/{QuestionNo}")]
        public async Task<ActionResult<Response>> CheckAnswer(string QuizID, int QuestionNo, string Answer)
        {
            var question = await _context.QUIZBODIes.FirstOrDefaultAsync(q => q.QuizID == QuizID && q.QuestionNo == QuestionNo);

            int score = 0;
            if (Answer != question.RightAnswer)
                return BadRequest(new Response { Status = 200, Data = score, Message = "Câu trả lời sai!" });

            score = score + question.QuestionScore;

            return Ok(new Response { Status = 200, Data = score, Message = "Câu trả lời đúng!" });
        }

        ///<summary>nộp bài</summary>
        [HttpPost("SubmitQuiz/{QuizID}")]
        public async Task<ActionResult<Response>> SubmitQuiz(string QuizID, string AccountID, int Score)
        {
            var quiz = await _context.QUIZs.FirstOrDefaultAsync(q => q.QuizID == QuizID);

            if (quiz == null)
                return BadRequest("Sai mã quiz!");

            if (quiz.StartTime > DateTime.Now || quiz.EndTime < DateTime.Now)
                return BadRequest("Không trong thời gian làm bài!");

            var quizAttemp = new QUIZATTEMP();
            quizAttemp.AttempID = AutoAttempID(QuizID, AccountID);
            quizAttemp.AccountID = AccountID;
            quizAttemp.QuizID = QuizID;
            quizAttemp.Score = Score;

            var quizAttempResult = await _context.QUIZATTEMPs.
                Join(_context.QUIZs,
                        attemp => attemp.QuizID,
                        quiz => quiz.QuizID,
                        (attemp, quiz) => new
                        {
                            AttempID = attemp.AttempID,
                            AccountID = attemp.AccountID,
                            QuizID = attemp.QuizID,
                            QuizName = quiz.QuizName,
                            Score = attemp.Score
                        }).
                Where(a => a.QuizID == QuizID).
                ToListAsync();

            await _context.QUIZATTEMPs.AddAsync(quizAttemp);
            await _context.SaveChangesAsync();

            return Ok(new Response { Status = 200, Data = quizAttempResult, Message = "Hoàn thành bài Quiz!" });
        }

        private string AutoAttempID(string quizID, string accountID)
        {
            int idNumber = _context.QUIZATTEMPs.Count();
            string ID = "ATP";

            //                        3  + 5      + 8         + 4                            = 20
            if (idNumber < 10) return ID + quizID + accountID + "000" + idNumber.ToString();
            if (idNumber < 100) return ID + quizID + accountID + "00" + idNumber.ToString();
            if (idNumber < 1000) return ID + quizID + accountID + "0" + idNumber.ToString();

            return ID + quizID + accountID + idNumber.ToString();
        }

        [HttpGet("ListAttemp")]
        public async Task<ActionResult<IEnumerable<QUIZATTEMP>>> ListAttemp(string accountID)
        {
            return await _context.QUIZATTEMPs.Where(q => q.AccountID == accountID).ToListAsync();
        }
    }
}
