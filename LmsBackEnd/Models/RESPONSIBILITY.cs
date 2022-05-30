
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LmsBackEnd.Models
{
    public class RESPONSIBILITY
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
    }
}
