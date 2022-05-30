using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class LessonCourse{


        [MaxLength(50)]
        public string CourseName {get; set;}

        [MaxLength(255)]
        public string CourseDetail {get; set;}

        public int CourseDuration {get; set;}

        public string UrlLink { get; set; }

        public string UrlLesson{get;set;}


    }
}