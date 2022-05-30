using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class FeedbackAtempAnswer {
        
     public int FeedbackAttempID { get; set; }

        public string AccountID { get; set; }

        public DateTime AttempWhen { get; set; }

        public string FeedbackID { get; set; }

        public string Answer1 { get; set; }
        public string Answer2 { get; set; }
        public string Answer3 { get; set; }
        public string Answer4 { get; set; }
        public string Answer5 { get; set; }
    }
}