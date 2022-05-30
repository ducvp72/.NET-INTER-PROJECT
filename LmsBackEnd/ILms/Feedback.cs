
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd
{
    public class Feedback : IFeedback
    {
        private readonly LmsContext _context;

        public Feedback(LmsContext context)
        {
            _context = context;
        }
        public async Task AnswerFeedback(FEEDBACKATTEMP feedbackattemp)
        {
            if(feedbackattemp == null)
            {
                throw new ArgumentNullException(nameof(feedbackattemp));
            }
            await _context.FEEDBACKATTEMPs.AddAsync(feedbackattemp);
        }

        public async Task CreateFeedback(FEEDBACK feedback)
        {
            if(feedback == null)
            {
                throw new ArgumentNullException(nameof(feedback));
            }
            await _context.FEEDBACKs.AddAsync(feedback);
        }

        public Task DeleteFeedback(Feedback feedback)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<FEEDBACKATTEMP>> GetAllAnswer()
        {
            var answer = await _context.FEEDBACKATTEMPs.Include(x=>x.Feedback).ToListAsync();
            return answer;
        }

        public async Task<IEnumerable<FEEDBACK>> GetAllQues()
        {
            var question = await _context.FEEDBACKs.Include(c => c.FeedbackAttemps).ToListAsync();
            return question;
        }

        public async Task<FEEDBACK> getFeedByID(string id)
        {
            // var idFeed = await _context.FEEDBACKs.FirstOrDefaultAsync(c => c.FeedbackID == id);
            var idFeed = await _context.FEEDBACKs.Include(c => c.FeedbackAttemps).FirstOrDefaultAsync(c => c.FeedbackID == id);
            return idFeed;
        }
        public async Task<FEEDBACKATTEMP> getFeedAByID(int id)
        {
            var idFeed = await _context.FEEDBACKATTEMPs.Include(x => x.Feedback).FirstOrDefaultAsync(c => c.FeedbackAttempID == id);
            return idFeed;
        }

        public async Task SaveChange()
        {
            await _context.SaveChangesAsync();
        }
    }
}