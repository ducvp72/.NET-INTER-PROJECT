using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class QUIZATTEMP {
        
        [Key]
        [MaxLength(20)]
        public string AttempID {get; set;}

        [MaxLength(5)]
        public string QuizID {get; set;}

        [MaxLength(8)]
        public string AccountID {get; set;}

        public int Score {get; set;}
    }
}

