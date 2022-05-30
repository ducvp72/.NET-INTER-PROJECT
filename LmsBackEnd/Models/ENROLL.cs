
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LmsBackEnd
{
    public class ENROLL
    {
        [Key, Column(Order = 1)]
        [Required]
        public string AccountID { get; set; }

        [ForeignKey("AccountID")]
        public ACCOUNT ACCOUNT { get; set; }

        [Key, Column(Order = 2)]
        [Required]
        public string CourseID { get; set; }

        [ForeignKey("CourseID")]
        public COURSE COURSE { get; set; }

        public int Score1 { get; set; }
        public int Score2 { get; set; }
        public int AvgScore { get; set; }



    }
}