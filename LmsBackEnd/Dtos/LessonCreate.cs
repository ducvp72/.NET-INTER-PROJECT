
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class LessonCreate
    {
        public string LessonID{get;set;}

        public string LessonName{get;set;}

        public string LessonDetail{get;set;}

        public int LessonDuration{get;set;}
        
        public string? UrlLesson{get;set;}

        public string CourseID { get; set; }

    }
}