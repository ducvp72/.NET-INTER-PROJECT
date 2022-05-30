
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LmsBackEnd
{
    public class LESSON
    {
        [Key]
        public string LessonID{get;set;}

        public string LessonName{get;set;}

        public string LessonDetail{get;set;}

        public int LessonDuration{get;set;}

        public string? UrlLesson{get;set;}

        [ForeignKey("CourseID")]
        public string CourseID { get; set; }

        public COURSE COURSE {get; set;}

        public ICollection<QUIZ> QUIZS { get; set; }
    }
}