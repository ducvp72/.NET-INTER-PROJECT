using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LmsBackEnd
{
    public class FEEDBACKATTEMP
    {

        [Key]
        public int FeedbackAttempID { get; set; }

        [MaxLength(8)]
        [ForeignKey("AccountID")]
        public string AccountID { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime AttempWhen { get; set; }

        public string FeedbackID { get; set; }

        [ForeignKey("FeedbackID")]
        public FEEDBACK Feedback { get; set; }

        public string Answer1 { get; set; }
        public string Answer2 { get; set; }
        public string Answer3 { get; set; }
        public string Answer4 { get; set; }
        public string Answer5 { get; set; }
    }
}


