using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.ModelHelper
{
    public class QuestionOutput
    {
        public int QuestionNo { get; set; }
        public string Question { get; set; }

        public string Answer1 { get; set; }

        public string Answer2 { get; set; }

        public string Answer3 { get; set; }

        public string Answer4 { get; set; }

        public int QuestionScore { get; set; }

        public int RightChoice { get; set; }

        public string QuizID { get; set; }
    }
}
