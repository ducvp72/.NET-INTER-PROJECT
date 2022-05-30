
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LmsBackEnd
{
    public class EditCourseUser
    {
        // public string CourseID { get; set; }
        public int Score1 { get; set; }
        public int Score2 { get; set; }
        public int AvgScore { get; set; }

    }
}