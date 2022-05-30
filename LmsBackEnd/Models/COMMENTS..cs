
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LmsBackEnd
{
    public class COMMENT {
        
        [Key]
        public int CommentID {get; set;}

        [MaxLength(255)]
        public string CommentDetail {get; set;}

        public DateTime CommentTime {get; set;}

        public string AccountName { get; set; }

        [ForeignKey("AccountID")]
        public string AccountID {get; set;}

        [ForeignKey("TopicID")]
        public string TopicID { get; set; }
    }
}