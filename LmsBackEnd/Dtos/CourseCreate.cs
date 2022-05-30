using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class CourseCreate{
        
        public string CourseID {get; set;}

        [MaxLength(50)]
        public string CourseName {get; set;}

        [MaxLength(255)]
        public string CourseDetail {get; set;}

        public int CourseDuration {get; set;}

        public string UrlLink { get; set; }
        
        [DefaultValue(null)]
        public Byte[] ImageCouse { get; set; }

    }
}