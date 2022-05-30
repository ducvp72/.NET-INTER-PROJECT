using System.Collections.Generic;
using System.Threading.Tasks;
namespace LmsBackEnd
{
    public interface IFeedback
    {
        Task<IEnumerable<FEEDBACK>> GetAllQues();
        Task<IEnumerable<FEEDBACKATTEMP>> GetAllAnswer();
        Task CreateFeedback(FEEDBACK feedback);
        Task AnswerFeedback(FEEDBACKATTEMP feedbackattemp);
        Task<FEEDBACK> getFeedByID(string id);
        Task<FEEDBACKATTEMP> getFeedAByID(int id);
        Task DeleteFeedback(Feedback feedback);
        Task SaveChange();
    }
}