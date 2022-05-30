using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.Models
{
    public class CLASSMEMBER
    {
        [Key]
        public int ID { get; set; }

        [ForeignKey("CourseID")]
        [Required]
        public string CourseID { get; set; }

        public COURSE COURSE { get; set; }

        [ForeignKey("InstructorID")]
        public string? InstructorID { get; set; }
        public ACCOUNT INSTRUCTOR { get; set; }

        [ForeignKey("MentorID")]
        public string? MentorID { get; set; }
        public ACCOUNT MENTOR { get; set; }

        [ForeignKey("ClassAdminID")]
        public string? ClassAdminID { get; set; }
        public ACCOUNT CLASSADMIN { get; set; }
    }
}
