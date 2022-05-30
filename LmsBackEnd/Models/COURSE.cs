using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class COURSE {
        
        [Key]
        public string CourseID {get; set;}

        public ICollection<ENROLL> ENROLLs { get; set; }

        public ICollection<LESSON> LESSONs { get; set; }

        [MaxLength(50)]
        public string CourseName {get; set;}

        [MaxLength(255)]
        public string CourseDetail {get; set;}

        public int CourseDuration {get; set;}

        public string UrlLink { get; set; }

        public string filetype { get; set; }



        // public Byte[] ImageCouse { get; set; }

    }
}