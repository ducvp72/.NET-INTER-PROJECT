using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class FEEDBACKQUESTION {
        
        [Key]
        [MaxLength(5)]
        public string QuestionNo {get; set;}

        [MaxLength(255)]
        public string Answer {get; set;}

        public int Rate {get; set;}

        [MaxLength(5)]
        public string FeedbackID {get; set;}

    }
}



