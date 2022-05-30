using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.ModelHelper
{
    public class QuizInput
    {
        public string QuizID { get; set; }

        public string QuizName { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string QuizDetail { get; set; }

        public string LessonID { get; set; }
    }
}
