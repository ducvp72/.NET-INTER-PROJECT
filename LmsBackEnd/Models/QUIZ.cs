using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LmsBackEnd
{
    public class QUIZ {
        
        [Key]
        public string QuizID {get; set;}

        public string QuizName {get; set;}

        public DateTime StartTime {get;set;}
        public DateTime EndTime {get;set;}

        public string QuizDetail {get; set;}

        [ForeignKey("LessonID")]
        public string LessonID { get; set; }

        public ICollection<QUIZBODY> QUIZBODYS { get; set; }
    }
}