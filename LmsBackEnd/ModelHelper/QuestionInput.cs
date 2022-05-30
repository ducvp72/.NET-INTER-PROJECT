using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.ModelHelper
{
    public class QuestionInput
    {
        public int QuestionNo { get; set; }
        public string Question { get; set; }

        public string RightAnswer { get; set; }

        public string WrongAnswer1 { get; set; }

        public string WrongAnswer2 { get; set; }

        public string WrongAnswer3 { get; set; }

        public int QuestionScore { get; set; }

    }
}
