using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.Models
{
    public class LessonInput
    {
        [Key]
        [MaxLength(5)]
        public string LessonID { get; set; }

        [MaxLength(50)]
        public string LessonName { get; set; }

        [MaxLength(255)]
        public string LessonDetail { get; set; }

        public int LessonDuration { get; set; }

        public string UrlLesson{get;set;}

        public string CourseID { get; set; }

    }
}
