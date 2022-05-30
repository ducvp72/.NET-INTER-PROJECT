using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LmsBackEnd
{
    public class QUIZBODY {
        
        [Key]
        public int QuestionID {get; set;}

        public int QuestionNo { get; set; }

        [MaxLength(255)]
        public string Question {get; set;}

        [MaxLength(255)]
        public string RightAnswer {get; set;}

        [MaxLength(255)]
        public string WrongAnswer1 {get; set;}

        [MaxLength(255)]
        public string WrongAnswer2 {get; set;}

        [MaxLength(255)]
        public string WrongAnswer3 {get; set;}

        public int QuestionScore {get; set;}

        [ForeignKey("QuizID")]
        public string QuizID {get;set;}
    }
}